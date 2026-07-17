import os
import sys
import time
import asyncio

from pathlib import Path

from biedit import _state


def check_deps():
  try:
    from playwright.async_api import async_playwright
  except ImportError:
    print("Generating PDF requires the playwright package. "
          + "Install it with: pip install playwright && playwright install chromium")


class MD2HTML:

  def __init__(self):
    check_deps()
    return None

  async def start(self):
    from playwright.async_api import async_playwright

    if hasattr(self, 'page'):
      return

    start = time.time()
    self._playwright = await async_playwright().start()
    self.browser = await self._playwright.chromium.launch(args=["--no-sandbox"], headless=True)
    self.page = await self.browser.new_page()
    self.page.on('console', lambda msg: print("Browser console: " + msg.text))
    print('%.4fs: browser launch time' % (time.time() - start))

    return self

  async def write(self, infile, outfile, outformat):

    url = "http://localhost:" + str(_state.options['port'])
    url = url + "/" + os.path.basename(infile) + "!#view=" + outformat

    start = time.time()
    print("Starting page.goto " + infile + "!#view=" + outformat)
    await self.page.goto(url, wait_until="domcontentloaded")
    print("%.4fs: Finished page.goto" % (time.time() - start))

    start = time.time()
    print("Starting page.reload()")
    # TODO: reload only needed when hash changes (when multiple calls)
    await self.page.reload()
    print("%.4fs: Finished page.reload" % (time.time() - start))

    # Screenshot needed b/c it forces DOM rendering to complete before
    # evaluation call.
    start = time.time()
    outpng = outfile + '.png'
    print("Starting page.screenshot. outpng = " + outpng)
    await self.page.screenshot(path=outpng)
    print("%.4fs: Finished page.screenshot" % (time.time() - start))

    start = time.time()
    outdata = await self.page.evaluate(f'''() => {{
        return ace.edit("{outformat}").getValue()
    }}''')
    print(f"%.4fs: {outformat} generation time" % (time.time() - start))
    with open(outfile, "w") as f:
      f.write(outdata)

  def convert(self, infile, outfile, outformat):

    async def task(infiles, outfile, outformat):

      start = time.time()
      await self.start()

      for outformat in _state.options['outformat']:
        outfmt_split = outformat.split("-")
        if len(outfmt_split) == 1:
          outext = outfmt_split[0]
        else:
          outext = ".".join(outfmt_split[1:]) + "." + outfmt_split[0]

        for infile in infiles:
          if _state.options['outfile'].endswith("/"):
            filename, ext = os.path.splitext(infile)
            filename = filename.split(os.sep)[-1]
            outfile = _state.options['outfile'] + filename + '.' + outext
          else:
            outfile = _state.options['outfile'].rsplit('.', maxsplit=1)[0] + '.' + outext

          print("Converting: " + infile + " to " + outformat)
          await self.write(infile, outfile, outformat)
          print("Wrote: " + outfile)

      print("-------\n%.4fs: total time" % (time.time() - start))
      await self.browser.close()
      await self._playwright.stop()

    def run():
      import glob
      infiles = glob.glob(_state.options['infile'])
      if len(infiles) == 0:
        print(f"glob.glob('{_state.options['infile']}') returned no matches")
        sys.exit(1)

      loop = asyncio.new_event_loop()
      asyncio.set_event_loop(loop)
      loop.run_until_complete(task(infiles, outfile, outformat))
      loop.close()
      from _thread import interrupt_main
      interrupt_main()

    import threading
    t = threading.Thread(target=run, daemon=True)
    t.start()


class HTML2PDF:

  def __init__(self):
    check_deps()
    return None

  async def start(self):
    from playwright.async_api import async_playwright

    if hasattr(self, 'page'):
      return

    start = time.time()
    self._playwright = await async_playwright().start()
    self.browser = await self._playwright.chromium.launch(args=["--no-sandbox"], headless=True)
    self.page = await self.browser.new_page()
    self.page.on('console', lambda msg: print(msg.text))
    print('Browser launch time: %.4f s' % (time.time() - start))

    return self

  async def convert(self, html, outfile):
    if not html.startswith("http"):
      html = Path(html).resolve()
      html = f"file:///{html}"

    start = time.time()

    # waitUntil causes a fairly long delay but is needed for images
    # Doing a reload fixes problem of blank PDF (b/c rendering not complete)
    print("Opening " + html)
    await self.page.goto(html)
    await self.page.emulate_media(media="print")
    await self.page.reload()  # Needed. See above about blank PDF.
    await self.page.pdf(
        path=outfile,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
    )
    print("PDF generation time: %.4f s" % (time.time() - start))


def convert():
  md2html = MD2HTML()
  md2html.convert(_state.options['infile'], _state.options['outfile'], _state.options['outformat'])
