import os
import sys
import webbrowser

from biedit import _state
from biedit.cli import cli
from biedit._convert import HTML2PDF
from biedit._server import CallbackHTTPServer, HTTPRequestHandler

# Directory containing this file — used to locate index.html and ui/ assets
_APP_DIR = os.path.dirname(os.path.abspath(__file__))


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
      print("")
    for process in children:
      print("Killing process named '{}' with pid = {}" \
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
  _state.options = cli()
  _state.html2pdf = HTML2PDF()

  set_signals()

  os.chdir(_state.options['dir'])

  for port in range(_state.options['port'], _state.options['port'] + 10):
    try:
      _state.options['port'] = port
      server = CallbackHTTPServer(('', port), HTTPRequestHandler)
      url = "http://localhost:" + str(port)
      if _state.options.get('file'):
        open_url = url + "/" + _state.options['file'] + "!"
      else:
        open_url = url
      if not _state.options['convert']:
        print("Edit files in " + _state.options['dir']
              + " at http://localhost:%d/" % port)
      if _state.options['open']:
        webbrowser.open_new(open_url)
      elif not _state.options['convert']:
        print("Use the -o option to open page automatically.")
      server.serve_forever()
    except OSError:
      print("Could not start BiEdit on port "
            + str(port) + ". Trying a different port.")

  raise OSError("Could not find an open port. Tried "
                + str(_state.options['port']) + "-" + str(_state.options['port'] + 9)
                + ". Specify a different port using the --port"
                + " command line argument.")


if __name__ == "__main__":
  main()
