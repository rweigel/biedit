import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler

import asyncio
import datetime
import random
import websockets

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

observer = Observer()
path = sys.argv[1] if len(sys.argv) > 1 else '.'
event_handler = LoggingEventHandler()
observer.schedule(event_handler, path, recursive=True)
observer.start()

async def time(websocket, path):
    while True:
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        await websocket.send(now)
        await asyncio.sleep(random.random() * 3)

start_server = websockets.serve(time, '127.0.0.1', 5678)
try:
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    observer.stop()
observer.join()
