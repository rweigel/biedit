import os
import sys
import optparse

_APP_DIR = os.path.dirname(os.path.abspath(__file__))

desc = """
BiEdit v0.0.2

    List server options and usage:

        biedit -h

    List conversion options and usage:

        biedit convert -h
"""


def cli():

  default_port = 8090
  app_dir = _APP_DIR

  outformats = {
    'pdf': '.pdf',
    'latex': '.tex',
    'latex-body': '.body.tex',
    'html': '.html',
    'html-body': '.body.html',
    'html-tagged-body-raw': '.tagged.body.raw.html',
    'html-tagged-body': '.tagged.body.html',
    'html-tagged': '.tagged.html',
  }

  allowed = list(outformats.keys())
  allowed_str = "|".join(allowed)
  parserc = optparse.OptionParser(add_help_option=False)
  parserc.add_option('-f', '--outformat',
                    default=None,
                    help='One of ' + allowed_str)
  parserc.add_option('-o', '--outfile',
                    default=None,
                    help='Output file name (default: path/to/infile.pdf)')
  parserc.add_option('-i', '--infile',
                    help='Input file name')
  parserc.add_option('-h', '--help',
                    dest='help',
                    action='store_true',
                    help='Show this help message and exit')
  parserc.add_option("-l", "--loglevel",
                    help="Log level " + "(error, default, debug) [%s]" % "default",
                    default="default")
  parserc.add_option("-d", "--dir",
                    help="Repository directory " + "[%s]" % os.getcwd(),
                    default=os.getcwd())

  cusage =  "\nbiedit convert <infile.md|'PATTERN'.md>\n"
  cusage += f"\t [-o outfile.{{{allowed_str}}}]"
  cusage += "\n\tor"
  cusage += f"\n\t [-f {{PATTERN|{allowed_str}}}]"

  if len(sys.argv) > 1 and sys.argv[1] == "convert":

    (options, args) = parserc.parse_args()
    options = vars(options)

    if options['infile'] is None:
      if len(args) > 1:
        options['infile'] = args[1]
      else:
        print("Error: No file to convert given.\nUsage: " + cusage)
        sys.exit(1)

    options['infile'] = os.path.abspath(options['infile'])

    if options['outformat'] is None:
      if options['outfile'] is None:
        filename, ext = os.path.splitext(options['infile'])
        options['outfile'] = filename
        options['outformat'] = allowed
      else:
        filename, ext = os.path.splitext(options['outfile'])
        if ext == "":
          options['outformat'] = allowed
        else:
          options['outformat'] = [ext[1:]]
    else:
      options['outformat'] = options['outformat'].split(",")
      if options['outfile'] is None or len(options['outfile']) == 0:
        filename, ext = os.path.splitext(options['infile'])
        options['outfile'] = filename

    for fmt in options['outformat']:
      if fmt not in allowed:
        print(f'Error: outformat "{fmt}" does not match one of {allowed}')
        sys.exit(1)

    options['port'] = default_port
    options['open'] = False
    options['dir'] = os.path.dirname(options['infile'])
    options['app'] = app_dir
    options['no_html'] = True
    options['convert'] = True
    if options['help']:
      parserc.set_usage(cusage)
      parserc.print_help()
      sys.exit(0)
  else:
    parsers = optparse.OptionParser(add_help_option=False)
    parsers.add_option('-h', '--help',
                      dest='help',
                      action='store_true',
                      help='Show this help message and exit')
    parsers.add_option("-l", "--loglevel",
                      help="Log level " + "(error, default, debug) [%s]" % "default",
                      default="default")
    parsers.add_option('-o', '--open',
                      action='store_true',
                      help='Open web page')
    parsers.add_option("-p", "--port",
                      type="int",
                      help="Server port " + "[%d]" % default_port,
                      default=default_port)
    parsers.add_option("-d", "--dir",
                      help="Repository directory " + "[%s]" % os.getcwd(),
                      default=os.getcwd())
    parsers.add_option("-r", "--remote",
                      help="Remote repository for push",
                      default="")
    if False:
      parsers.add_option("-s", "--symlink",
                        action='store_true',
                        help="Create symlinks (ln -s file.html file).")
    parsers.add_option("--no-html",
                      action='store_true',
                      help="Do not save file.html when file.md saved.",
                      default=False)
    parsers.add_option("--no-pdf",
                      action='store_true',
                      help="Do not save file.pdf when file.md saved.",
                      default=True)
    parsers.add_option("-a", "--app",
                      help="Application location [%s]" % app_dir,
                      default=app_dir)

    (options, args) = parsers.parse_args()
    options = vars(options)
    options['convert'] = False

    # Positional argument: biedit [file.md]
    positional = [a for a in args if not a.startswith('-')]
    if positional:
      filepath = os.path.abspath(positional[0])
      options['dir'] = os.path.dirname(filepath)
      options['file'] = os.path.basename(filepath)
      options['open'] = True
    else:
      options['file'] = ''

    if options['help']:
      print(desc)
      print("-- Server --")
      parsers.print_help()
      print("")
      print("-- Conversion --")
      parserc.set_usage(cusage)
      parserc.print_help()
      sys.exit(0)

    from biedit._git import repository_info
    repository = repository_info(options['remote'])
    if repository is not None:
      print("Remote: " + repository['url'])
      print("Credentials: " + str(repository['credentials']))

  return options
