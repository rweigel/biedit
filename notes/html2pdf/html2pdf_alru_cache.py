import time
import asyncio
from pathlib import Path
from pyppeteer import launch
from async_lru import alru_cache

# Based on
# https://www.programcreek.com/python/example/119403/pyppeteer.launch
async def main(html, outfile):
    try:
        from pyppeteer import launch
    except ImportError:
        _error(
            "Generating PDF from book HTML requires the pyppeteer package. "
            "Install it first.",
            ImportError,
        )

    if not html.startswith("http"):
        # Absolute path is needed
        html = Path(html).resolve()
        html = f"file:///{html}"

    page_margins = {"left": "1in", "right": "1in", "top": ".5in", "bottom": ".5in"}


    @alru_cache(maxsize=32)
    async def cbrowser():
        browser = await launch(args=["--no-sandbox"])
        return browser

    @alru_cache(maxsize=32)
    async def cpage(html):
        browser = await cbrowser()
        page = await browser.newPage()
        await page.goto(html)
        return page

    start = time.time()
    page = await cpage(html)
    end = time.time()
    print(end - start)

    start = time.time()
    await page.reload()
    await page.emulateMedia("print")
    await page.pdf({"path": outfile, "margin": page_margins})
    end = time.time()
    print(end - start)

    # TODO: Use this if page has already been visited.
    # Need to cache page
    start = time.time()
    await page.reload()
    await page.emulateMedia("print")
    await page.pdf({"path": outfile, "margin": page_margins})
    end = time.time()
    print(end - start)

def xmain():
    infile = "http://localhost:8080/edit/README.html"
    infile = "README.html"
    outfile = "README.pdf"
    asyncio.get_event_loop().run_until_complete(main(infile, outfile))

xmain()