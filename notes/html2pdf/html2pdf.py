import os
import sys
import json
import time
import asyncio
import optparse
import subprocess
import webbrowser
from pathlib import Path
from pyppeteer import launch

file = 'html2pdf'

class pdf2html:

    def __init__(self):
        try:
            from pyppeteer import launch
        except ImportError:
            print("Generating PDF requires the pyppeteer package. " \
                  + "Install it first.")

        return None

    async def start(self):
        start = time.time()
        browser = await launch(args=["--no-sandbox"], 
                    headless=True,
                    handleSIGTERM=False,
                    handleSIGINT=False,
                )
        self.page = await browser.newPage()
        end = time.time()
        print('Browser launch time: %.4f s' % (end - start))

        return self

    async def write_pdf(self, html, outfile):
        # Based on
        # https://www.programcreek.com/python/example/119403/pyppeteer.launch
        if not html.startswith("http"):
            html = Path(html).resolve()
            html = f"file:///{html}"

        page_margins = {
            "left": "1in",
            "right": "1in",
            "top": ".5in",
            "bottom": ".5in"
        }

        start = time.time()
        # https://miyakogi.github.io/pyppeteer/reference.html#pyppeteer.page.Page.goto
        #await self.page.goto(html, {"waitUntil": "domcontentloaded"})
        await self.page.goto(html)
        await self.page.emulateMedia("print")
        # The following causes a fairly long delay
        #await page.goto(html, {"waitUntil": "networkidle0"})
        # Doing a reload fixes problem of blank PDF (b/c rendering not complete)
        # See also https://swizec.com/blog/how-to-wait-for-dom-elements-to-show-up-in-modern-browsers
        # and https://stackoverflow.com/questions/15875128/is-there-element-rendered-event
        # Needed for katex-chtml
        await self.page.reload() # Needed.
        await self.page.pdf({"path": outfile, "margin": page_margins})
        end = time.time()
        print("PDF generation time: %.4f s" % (end - start))


p = pdf2html()
async_run = asyncio.get_event_loop().run_until_complete
async_run(p.start())
async_run(p.write_pdf(file + '.html', file + '.pdf'))
async_run(p.write_pdf(file + '.html', file + '.pdf2'))
