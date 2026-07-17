import asyncio

_event_loop = asyncio.new_event_loop()
asyncio.set_event_loop(_event_loop)
async_run = _event_loop.run_until_complete

options = None
html2pdf = None
