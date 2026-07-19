import os
import sys
import logging
import optparse

from biedit.git import repository_info

logger = logging.getLogger(__name__)

APP_DIR = os.path.dirname(os.path.abspath(__file__))

ALLOWED_FORMATS = [
  'pdf', 'latex', 'latex-body',
  'html', 'html-body',
  'html-tagged-body-raw', 'html-tagged-body', 'html-tagged',
]

format_map = {
    'pdf': '.pdf',
    'latex': '.tex',
    'latex-body': '.body.tex',
    'html': '.html',
    'html-body': '.body.html',
    'html-tagged-body-raw': '.tagged.body.raw.html',
    'html-tagged-body': '.tagged.body.html',
    'html-tagged': '.tagged.html',
}

ALLOWED_FORMATS = list(format_map.keys())


desc = """
BiEdit v0.0.2

    List server options and usage:

        biedit -h

    List conversion options and usage:

        biedit convert -h
"""


def cli():

  default_port = 8090
  allowed = ALLOWED_FORMATS
  allowed_str = '|'.join(allowed)
  cusage = (f"\nbiedit convert <infile.md|'PATTERN'.md>\n"
            f"\t [-o outfile.{{{allowed_str}}}]\n"
            f"\tor\n"
            f"\t [-f {{PATTERN|{allowed_str}}}]")

  parserc = optparse.OptionParser(add_help_option=False)
  parserc.add_option('-f', '--out-format', default=None,
                     help='One of ' + allowed_str)
  ext_map = ', '.join(f'{f}: {e}' for f, e in format_map.items())
  parserc.add_option('-o', '--out-file', default=None,
                     help='Output base name; extension set by -f (' + ext_map + '). '
                          'Trailing slash: use as output directory.')
  parserc.add_option('-i', '--in-file', help='Input file name')
  parserc.add_option('-h', '--help', dest='help', action='store_true',
                     help='Show this help message and exit')
  parserc.add_option('-l', '--log-level', default='default',
                     help='Log level (error, default, debug) [default]')
  parserc.add_option('-d', '--dir', default=os.getcwd(),
                     help='Repository directory [%s]' % os.getcwd())

  if len(sys.argv) > 1 and sys.argv[1] == 'convert':

    options, args = parserc.parse_args()
    options = vars(options)

    if options['in_file'] is None:
      if len(args) > 1:
        options['in_file'] = args[1]
      else:
        logger.error('Error: No file to convert given.\nUsage: ' + cusage)
        sys.exit(1)

    options['in_file'] = os.path.abspath(options['in_file'])
    if options['out_file'] is not None:
      options['out_file'] = os.path.abspath(options['out_file'])

    if options['out_format'] is None:
      if options['out_file'] is None:
        options['out_file'] = os.path.splitext(options['in_file'])[0]
        options['out_format'] = allowed
      else:
        ext = os.path.splitext(options['out_file'])[1]
        options['out_format'] = allowed if ext == '' else [ext[1:]]
    else:
      options['out_format'] = options['out_format'].split(',')
      if not options['out_file']:
        options['out_file'] = os.path.splitext(options['in_file'])[0]

    for fmt in options['out_format']:
      if fmt not in allowed:
        logger.error(f'Error: out-format "{fmt}" does not match one of {allowed}')
        sys.exit(1)

    options.update({
      'port': default_port,
      'open': False,
      'dir': os.path.dirname(options['in_file']),
      'app': APP_DIR,
      'no_html': True,
      'convert': True,
    })

    if options['help']:
      parserc.set_usage(cusage)
      parserc.print_help()
      sys.exit(0)

  else:
    parsers = optparse.OptionParser(add_help_option=False)
    parsers.add_option('-h', '--help', dest='help', action='store_true',
                       help='Show this help message and exit')
    parsers.add_option('-l', '--log-level', default='default',
                       help='Log level (error, default, debug) [default]')
    parsers.add_option('-o', '--open', action='store_true',
                       help='Open web page')
    parsers.add_option('-p', '--port', type='int', default=default_port,
                       help='Server port [%d]' % default_port)
    parsers.add_option('-d', '--dir', default=os.getcwd(),
                       help='Repository directory [%s]' % os.getcwd())
    parsers.add_option('-r', '--remote', default='',
                       help='Remote repository for push')
    parsers.add_option('--no-html', action='store_true', default=False,
                       help='Do not save file.html when file.md saved.')
    parsers.add_option('-a', '--app', default=APP_DIR,
                       help='Application location [%s]' % APP_DIR)

    options, args = parsers.parse_args()
    options = vars(options)
    options['convert'] = False

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
      print('-- Server --')
      parsers.print_help()
      print('')
      print('-- Conversion --')
      parserc.set_usage(cusage)
      parserc.print_help()
      sys.exit(0)

    repository = repository_info(options['remote'])
    if repository is not None:
      logger.info('Remote: ' + repository['url'])
      logger.info('Credentials: ' + str(repository['credentials']))

  return options
