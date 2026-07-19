import os
import json
import shlex
import logging
import subprocess

from pathlib import Path
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler

from biedit.convert import convert
from biedit.git import _find_git_dir, push_url

logger = logging.getLogger(__name__)


def dirwalk(selected):

  logger.debug("Creating options drop-down with '" + selected + "' selected.")

  base = os.path.abspath(os.getcwd())
  Nb = len(base.split(os.sep))  # Number of blanks

  html = ''
  if selected == '':
    html = '<option selected value="">File</option>'

  for root, dirs, files in os.walk(base):
    dirs.sort()

    path = root.split(os.sep)
    if len(path) == 1 and path[0] == '.':
      continue
    if '.git' in path or any(p.startswith('.') for p in path[Nb:]):
      continue

    root = root.replace(base, "")
    indent = 4*(len(path) - Nb)*'&nbsp;'
    dir = root.split("/")[-1]
    if dir == '':
      dir = '.'
    html = html + '<optgroup label="' + indent + dir + '">'
    files.sort()
    for file in files:
      if not (file.endswith(".md") or file.endswith(".css")):
        continue
      value = root + '/' + file
      if selected.startswith(value[1:]):
        start = '<option selected value="' + value[1:] + '">'
      else:
        start = '<option value="' + value[1:] + '">'

      end = '</option>'
      if indent == "":
        html = html + start + file + end
      else:
        html = html + start + indent + '' + file + end
    html = html + '</optgroup>'

  return html


# https://stackoverflow.com/a/16838003
class CallbackHTTPServer(HTTPServer):

  def __init__(self, server_address, RequestHandlerClass, options, html2pdf, async_run):
    self.options = options
    self.html2pdf = html2pdf
    self.async_run = async_run
    super().__init__(server_address, RequestHandlerClass)

  def server_activate(self):
    HTTPServer.server_activate(self)
    if self.options["convert"]:
      logger.info("Server activated. Calling convert().")
      convert(self.options)


class HTTPRequestHandler(SimpleHTTPRequestHandler):

  def log_message(self, format, *args):
    logger.debug('%s - - [%s] %s',
                 self.client_address[0], self.log_date_time_string(), format % args)

  def end_headers(self):
    # Overrides default end_headers().
    if self.path.endswith('.md'):
      self.send_header("Content-type", "text/markdown; charset=utf-8")
    if "." not in os.path.basename(self.path):
      self.send_header("Content-type", "text/html; charset=utf-8")
    SimpleHTTPRequestHandler.end_headers(self)

  def translate_path(self, path):
    # https://stackoverflow.com/a/46332163
    path = SimpleHTTPRequestHandler.translate_path(self, path)
    if self.path.startswith("/ui/"):
      relpath = os.path.relpath(path, os.getcwd())
      fullpath = os.path.join(self.server.options['app'], relpath)
      return fullpath
    else:
      return path

  def do_GET(self):

    URL = urlparse(self.path)
    query = parse_qs(URL.query)

    if URL.path.startswith("/ui/deps/"):
      return SimpleHTTPRequestHandler.do_GET(self)

    if URL.path == '/' or URL.path[-1] == '!':
      # Trailing ! means "edit"

      # remove leading / and trailing !
      initialFile = URL.path[1:-1]
      if URL.path == '/':
        initialFile = ''

      self.send_response(200)
      self.send_header("Content-type", "text/html; charset=utf-8")
      self.end_headers()

      if initialFile != '' and not os.path.exists(initialFile):
        logger.info('Touching ' + initialFile)
        Path(initialFile).touch()

      initialFile = initialFile.split(os.sep)[-1]

      index = os.path.join(self.server.options['app'], 'ui', 'index.html')
      with open(index, "rt") as fin:
        data = fin.read()
        logger.debug(f"Sending {index} with initialFile = '{initialFile}'")
        data = data.replace("${files}", dirwalk(URL.path[1:-1]))
        orig = "initialFile: 'index.md'"
        repl = f"initialFile: '{initialFile}'"
        data = data.replace(orig, repl)

      if self.server.options['no_html']:
        data = data.replace("noHTML: false", "noHTML: true")

      if not os.path.exists(".sourcedir"):
        data = data.replace("allowIndexMD: false", "allowIndexMD: true")

      self.wfile.write(bytes(data, 'utf-8'))
    else:
      if "infile" in query and query["infile"][0].endswith('.html'):
        outfile = URL.path[1:].split("?")[0]
        infile = query["infile"][0][1:]
        logger.info('Generating: ' + outfile + ' from ' + infile)
        self.server.async_run(self.server.html2pdf.start())
        self.server.async_run(self.server.html2pdf.convert(infile, outfile))
        logger.info('Generated: ' + outfile)

      # File has been generated. Hand off request to default do_GET(),
      # which will respond with file.
      return SimpleHTTPRequestHandler.do_GET(self)

  def do_POST(self):

    if self.server.options['convert']:
      self.send_response(200)
      self.send_header('Content-type', 'text/html; charset=utf-8')
      self.end_headers()
      return

    length = self.headers['content-length']
    post_bytes = self.rfile.read(int(length))
    post = json.loads(post_bytes)

    # Remove leading slash
    file_save = self.path[1:]

    if 'command' in post:

      if post['command'] == 'commit':
        file_base = shlex.quote(os.path.splitext(file_save)[0])
        message = shlex.quote(post['message'])
        cmd = 'git add ' + file_base + "*"
        cmd = cmd + "; git commit " + file_base + "*" \
              + " -m " + message + "; echo Done"
      elif post['command'] == 'push':
        if not _find_git_dir():
          self.send_error(501, "Cannot push: no git repository found.")
          return
        else:
          credentials = self.server.options['credentials']
          if credentials:
            target = push_url(credentials)
            if target is None:
              self.send_error(501, "Cannot push with --credentials: remote URL is not HTTPS.")
              return
          else:
            target = ''
          cmd = "git push " + target + "; echo Done"
      else:
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        return

      self.send_response(200)
      self.send_header('Content-type', 'text/html; charset=utf-8')
      self.end_headers()

      logger.info('Executing ' + cmd)
      stream = subprocess.Popen(cmd, shell=True,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
      while True:
        line = stream.stdout.readline()
        logger.info(line.decode().rstrip())
        self.wfile.write(line)
        if not line:
          break

    elif any(k in post for k in ('markdown', 'html', 'css', 'latex')):

      file_path = os.path.dirname(file_save)
      if file_path != '':
        os.makedirs(file_path, exist_ok=True)

      file_base = os.path.splitext(file_save)[0]

      if 'markdown' in post:
        logger.info('Writing ' + os.path.join(self.server.options['dir'], file_base + '.md'))
        with open(file_base + '.md', 'w') as fh:
          fh.write(post['markdown'])

      if 'css' in post:
        logger.info('Writing ' + os.path.join(self.server.options['dir'], file_base + '.css'))
        with open(file_base + '.css', 'w') as fh:
          fh.write(post['css'])

      if 'latex' in post:
        logger.info('Writing ' + os.path.join(self.server.options['dir'], file_base + '.tex'))
        with open(file_base + '.tex', 'w') as fh:
          fh.write(post['latex'])

      if 'html' in post and post['html'] != '':
        logger.info('Writing ' + os.path.join(self.server.options['dir'], file_base + '.html'))
        with open(file_base + '.html', 'w') as fh:
          fh.write(post['html'])

      self.send_response(200)
      self.send_header('Content-type', 'text/html; charset=utf-8')
      self.end_headers()
      self.wfile.write(bytes("Wrote " + file_base + ".{md,html}\n", 'utf-8'))

    else:

      self.send_response(200)
      self.send_header('Content-type', 'text/html; charset=utf-8')
      self.end_headers()
      self.wfile.write(bytes("Nothing to do.\n", 'utf-8'))
