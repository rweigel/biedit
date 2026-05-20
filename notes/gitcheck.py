import os
from pathlib import Path

r = 'https://gitlab.com/rweigel/biedit'

def repository_info():
	import re

	gitPath = os.path.join(os.getcwd(),'.git')

	def rm_credentials(url):
		return re.sub(r'\/\/(.+@)', '//', url)

	def normalize(url):
		return re.sub(r'\/$|\.git$|\.git\/', '', url)

	url = None
	if os.path.exists(gitPath):
		if debug:
			print('git dir found')
		configFile = os.path.join(gitPath,'config')
		if configFile:
			if debug:
				print("git config file found")
			file1 = open(configFile, 'r')
			lines = file1.readlines()
			for line in lines:
				line = line.strip()
				if line.startswith('url = '):
					line = line.replace('url = ', '')
					url = rm_credentials(line)
					if url == line:
						print('No credentials in URL in ./git/config. Push from BiEdit will not be possible.')
					if normalize(url) != normalize(r):
						raise ValueError('Repository URL given on command line \n   ' \
											+ r + '\ndoes not match URL in .git/config\n   ' \
											+ url)

	return url

url = repository_info()
print(url)
