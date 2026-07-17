import os
import json
import subprocess

from pathlib import Path
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler

from biedit import _state
from biedit._convert import convert
from biedit._git import repository_info


def dirwalk(selected, outfmt='html'):

  print("Creating options drop-down with '" + selected + "' selected.")

  def json_tree(selected):
    base = os.path.abspath(os.getcwd())
    json_list = []
    for root, dirs, files in os.walk(base):
      path = root.split(os.sep)
      if len(path) == 1 and path[0] == '.':
        continue
      if '.git' in path:
        continue

      json_list.append({'title': path[-1], 'isSelectable': 'false', 'subs': []})
      for file in files:
        json_list[-1]['subs'].append({'title': file})
    return json_list

  if outfmt == 'json':
    return json_tree(selected)

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
    if '.git' in path:
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

  def server_activate(self):
    HTTPServer.server_activate(self)
    if _state.options["convert"]:
      print("Server activated. Calling convert().")
      convert()


class HTTPRequestHandler(SimpleHTTPRequestHandler):

  def log_message(self, format, *args):
    if _state.options["loglevel"] == "debug":
      print("%s - - [%s] %s" % \
            (self.client_address[0], self.log_date_time_string(), format % args))

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
      fullpath = os.path.join(_state.options['app'], relpath)
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
        print('Touching ' + initialFile)
        Path(initialFile).touch()

      initialFile = initialFile.split(os.sep)[-1]

      index = os.path.join(_state.options['app'], 'index.html')
      with open(index, "rt") as fin:
        data = fin.read()
        print(f"Sending {index} with initialFile = '{initialFile}'")
        data = data.replace("${files}", dirwalk(URL.path[1:-1]))
        orig = "initialFile: 'index.md'"
        repl = f"initialFile: '{initialFile}'"
        data = data.replace(orig, repl)

      if _state.options['no_html'] == True:
        data = data.replace("noHTML: false", "noHTML: true")

      if not os.path.exists(".sourcedir"):
        data = data.replace("allowIndexMD: false", "allowIndexMD: true")

      self.wfile.write(bytes(data, 'utf-8'))
    else:
      if "infile" in query and query["infile"][0].endswith('.html'):
        outfile = URL.path[1:].split("?")[0]
        infile = query["infile"][0][1:]
        print('Generating: ' + outfile + " from " + infile)
        _state.async_run(_state.html2pdf.start())
        _state.async_run(_state.html2pdf.convert(infile, outfile))
        print('Generated: ' + outfile)

      # File has been generated. Hand off request to default do_GET(),
      # which will respond with file.
      return SimpleHTTPRequestHandler.do_GET(self)

  def do_POST(self):

    length = self.headers['content-length']
    post_bytes = self.rfile.read(int(length))
    post = json.loads(post_bytes)

    # Remove leading slash
    file_save = self.path[1:]

    if 'command' in post:

      if post['command'] == 'commit':
        file_base = os.path.splitext(file_save)[0]
        cmd = 'git add ' + file_base + "*"
        cmd = cmd + "; git commit " + file_base + "*" \
              + " -m '" + post['message'] + "'; echo Done"
      elif post['command'] == 'push':
        repository = repository_info(_state.options['remote'])
        if not repository['credentials']:
          msg = "Cannot push: server not configured with remote repository."
          self.send_error(501, {"Error": msg})
          return
        else:
          cmd = "git push " + _state.options['remote'] + "; echo Done"
      else:
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        return

      self.send_response(200)
      self.send_header('Content-type', 'text/html; charset=utf-8')
      self.end_headers()

      print("Executing " + cmd)
      stream = subprocess.Popen(cmd, shell=True,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
      while True:
        line = stream.stdout.readline()
        print(line.decode().rstrip())
        self.wfile.write(line)
        if not line:
          break

    elif 'markdown' or 'html' or 'css' or 'latex' in post:

      file_path = os.path.dirname(file_save)
      if file_path != '':
        os.makedirs(file_path, exist_ok=True)

      file_base = os.path.splitext(file_save)[0]

      if 'markdown' in post:
        print("Writing " + os.path.join(_state.options['dir'], file_base + '.md'))
        with open(file_base + '.md', 'w') as fh:
          fh.write(post['markdown'])

      if 'css' in post:
        print("Writing " + os.path.join(_state.options['dir'], file_base + '.css'))
        with open(file_base + '.css', 'w') as fh:
          fh.write(post['css'])

      if 'latex' in post:
        print("Writing " + os.path.join(_state.options['dir'], file_base + '.tex'))
        with open(file_base + '.tex', 'w') as fh:
          fh.write(post['latex'])

      if 'html' in post and post['html'] != '':
        print("Writing " + os.path.join(_state.options['dir'], file_base + '.html'))
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
