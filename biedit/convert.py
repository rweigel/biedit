import os
import sys
import time
import asyncio
import logging

from biedit.cli import FORMAT_MAP

logger = logging.getLogger(__name__)


def check_deps():
  try:
    from playwright.async_api import async_playwright
  except ImportError:
    logger.error('Generating PDF requires the playwright package. '
                 'Install it with: pip install playwright && playwright install chromium')


class MD2HTML:

  def __init__(self, options):
    self.options = options
    check_deps()

  async def start(self):
    from playwright.async_api import async_playwright

    if hasattr(self, 'page'):
      return

    start = time.time()
    self._playwright = await async_playwright().start()
    self.browser = await self._playwright.chromium.launch(args=["--no-sandbox"], headless=True)
    self.page = await self.browser.new_page()
    self.page.on('console', lambda msg: logger.debug('Browser console: ' + msg.text))
    logger.debug('%.4fs: browser launch time' % (time.time() - start))

    return self


  async def write(self, infile, outfile, outformat):

    url = "http://localhost:" + str(self.options['port'])
    url = url + "/" + os.path.basename(infile) + "!#view=" + outformat

    start = time.time()
    logger.debug('Starting page.goto ' + infile + '!#view=' + outformat)
    await self.page.goto(url, wait_until="domcontentloaded")
    logger.debug('%.4fs: Finished page.goto' % (time.time() - start))

    start = time.time()
    logger.debug('Starting page.reload()')
    # TODO: reload only needed when hash changes (when multiple calls)
    await self.page.reload()
    logger.debug('%.4fs: Finished page.reload' % (time.time() - start))

    # Screenshot needed b/c it forces DOM rendering to complete before
    # evaluation call.
    start = time.time()
    outpng = outfile + '.png'
    logger.debug('Starting page.screenshot. outpng = ' + outpng)
    await self.page.screenshot(path=outpng)
    logger.debug('%.4fs: Finished page.screenshot' % (time.time() - start))

    start = time.time()
    outdata = await self.page.evaluate(f'''() => {{
        return ace.edit("{outformat}").getValue()
    }}''')
    logger.debug('%.4fs: %s generation time' % (time.time() - start, outformat))
    with open(outfile, "w") as f:
      f.write(outdata)


  def convert(self):

    async def task():

      start = time.time()
      await self.start()

      for outformat in self.options['out_format']:
        ext = FORMAT_MAP[outformat]

        for infile in infiles:
          if self.options['out_file'].endswith('/'):
            filename = os.path.splitext(infile)[0].split(os.sep)[-1]
            outfile = self.options['out_file'] + filename + ext
          else:
            outfile = os.path.splitext(self.options['out_file'])[0] + ext

          logger.info('Converting: ' + infile + ' to ' + outformat)
          await self.write(infile, outfile, outformat)
          logger.info('Wrote: ' + outfile)

      logger.info('-------\n%.4fs: total time' % (time.time() - start))
      await self.browser.close()
      await self._playwright.stop()

    def run():
      import glob
      infiles = glob.glob(self.options['in_file'])
      if len(infiles) == 0:
        logger.error(f"glob.glob('{self.options['in_file']}') returned no matches")
        sys.exit(1)

      loop = asyncio.new_event_loop()
      asyncio.set_event_loop(loop)
      loop.run_until_complete(task())
      loop.close()
      from _thread import interrupt_main
      interrupt_main()

    import threading
    t = threading.Thread(target=run, daemon=True)
    t.start()


class HTML2PDF:


  def __init__(self):
    check_deps()

  async def start(self):
    from playwright.async_api import async_playwright

    if hasattr(self, 'page'):
      return

    start = time.time()
    self._playwright = await async_playwright().start()
    self.browser = await self._playwright.chromium.launch(args=["--no-sandbox"], headless=True)
    self.page = await self.browser.new_page()
    self.page.on('console', lambda msg: logger.debug(msg.text))
    logger.debug('Browser launch time: %.4f s' % (time.time() - start))

    return self

  async def convert(self, html, outfile):

    import pathlib

    if not html.startswith("http"):
      html = pathlib.Path(html).resolve()
      html = f"file:///{html}"

    start = time.time()

    # waitUntil causes a fairly long delay but is needed for images
    # Doing a reload fixes problem of blank PDF (b/c rendering not complete)
    logger.info('Opening ' + str(html))
    await self.page.goto(html)
    await self.page.emulate_media(media="print")
    await self.page.reload()  # Needed. See above about blank PDF.
    await self.page.pdf(
        path=outfile,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
    )
    logger.info('PDF generation time: %.4f s' % (time.time() - start))


def convert(options):
  md2html = MD2HTML(options)
  md2html.convert()
