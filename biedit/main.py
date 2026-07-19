import os
import sys
import asyncio
import logging
import webbrowser

from biedit.cli import cli
from biedit.convert import HTML2PDF
from biedit.server import CallbackHTTPServer, HTTPRequestHandler

logger = logging.getLogger(__name__)

_event_loop = asyncio.new_event_loop()
asyncio.set_event_loop(_event_loop)
async_run = _event_loop.run_until_complete

def set_signals():
  import signal
  import psutil

  def kill_child_processes(parent_pid, sig=signal.SIGTERM):
    try:
      parent = psutil.Process(parent_pid)
    except psutil.NoSuchProcess:
      return
    children = parent.children(recursive=True)
    if len(children) > 0:
      logger.info('')
    for process in children:
      logger.info("Killing process named '{}' with pid = {}"
            .format(process.name(), process.pid))
      try:
        process.send_signal(sig)
      except:
        pass  # Process was already killed.

  def handler_stop_signals(signum, frame):
    kill_child_processes(os.getpid())
    sys.exit(0)

  signal.signal(signal.SIGINT, handler_stop_signals)
  signal.signal(signal.SIGTERM, handler_stop_signals)


def main():
  options = cli()

  log_levels = {'error': logging.ERROR, 'debug': logging.DEBUG}
  logging.basicConfig(level=log_levels.get(options['log_level'], logging.INFO),
                      format='%(message)s')

  html2pdf = HTML2PDF()

  set_signals()

  os.chdir(options['dir'])

  for port in range(options['port'], options['port'] + 10):
    try:
      options['port'] = port
      server = CallbackHTTPServer(('', port), HTTPRequestHandler, options, html2pdf, async_run)
      url = "http://localhost:" + str(port)
      if options.get('file'):
        open_url = url + "/" + options['file'] + "!"
      else:
        open_url = url
      if not options['convert']:
        logger.info('Edit files in ' + options['dir']
                    + ' at http://localhost:%d/' % port)
      if options['open']:
        webbrowser.open_new(open_url)
      elif not options['convert']:
        logger.info('Use the -o option to open page automatically.')
      server.serve_forever()
    except OSError:
      logger.warning('Could not start BiEdit on port '
                     + str(port) + '. Trying a different port.')

  raise OSError("Could not find an open port. Tried "
                + str(options['port']) + "-" + str(options['port'] + 9)
                + ". Specify a different port using the --port"
                + " command line argument.")


if __name__ == "__main__":
  main()
