import os
import re


def repository_info(url_cl):

  gitPath = os.path.join(os.getcwd(), '.git')

  def rm_credentials(url):
    return re.sub(r'\/\/(.+@)', '//', url)

  def normalize(url):
    return re.sub(r'\/$|\.git$|\.git\/', '', url)

  credentials_cl = rm_credentials(url_cl) != url_cl
  url = None
  credentials = False
  if os.path.exists(gitPath):
    configFile = os.path.join(gitPath, 'config')
    if configFile:
      file1 = open(configFile, 'r')
      lines = file1.readlines()
      for line in lines:
        line = line.strip()
        if line.startswith('url = '):
          line = line.replace('url = ', '')
          credentials = True
          url = rm_credentials(line)
          if url == line:
            print('No credentials in URL in ./git/config. '
                  + 'Push from BiEdit will not be possible.')

  if url and url_cl:
    if normalize(url) != normalize(url_cl):
      raise ValueError('Repository URL given on command line \n   '
                       + url_cl
                       + '\ndoes not match URL in .git/config\n   '
                       + url)

  if url:
    return {'url': normalize(rm_credentials(url)), 'credentials': credentials}
  if url_cl:
    return {'url': normalize(rm_credentials(url_cl)), 'credentials': credentials_cl}
