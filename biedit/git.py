import os
import re
import logging

logger = logging.getLogger(__name__)


def _find_git_dir():
  search = os.getcwd()
  while True:
    candidate = os.path.join(search, '.git')
    if os.path.exists(candidate):
      return candidate
    parent = os.path.dirname(search)
    if parent == search:
      return None
    search = parent


def repository_info():
  """Return {'url': str, 'credentials': bool} for the current repo, or None."""

  gitPath = _find_git_dir()
  if gitPath is None:
    return None

  def rm_credentials(url):
    return re.sub(r'\/\/(.+@)', '//', url)

  def normalize(url):
    return re.sub(r'\/$|\.git$|\.git\/', '', url)

  url = None
  credentials = False
  configFile = os.path.join(gitPath, 'config')
  with open(configFile, 'r') as f:
    for line in f:
      line = line.strip()
      if line.startswith('url = '):
        url = line.replace('url = ', '')
        credentials = rm_credentials(url) != url
        url = rm_credentials(url)
        break

  if url is None:
    return None
  return {'url': normalize(url), 'credentials': credentials}


def push_url(credentials):
  """Build a push URL by injecting credentials into the repo's remote URL.

  credentials: 'token' or 'username:token'
  Returns the push URL string, or None if no HTTPS remote is found.
  """
  info = repository_info()
  if info is None:
    return None
  url = info['url']
  if not url.startswith('https://'):
    return None
  return re.sub(r'https://', f'https://{credentials}@', url)
