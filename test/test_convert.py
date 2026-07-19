import os
import subprocess

import pytest

from biedit.cli import FORMAT_MAP

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
MD_FILE = os.path.join(TEST_DIR, 'test_convert.md')
NEEDLE = 'Hello from test_convert'

# pdf excluded: binary format, not text-searchable
FORMATS = {fmt: ext for fmt, ext in FORMAT_MAP.items() if fmt != 'pdf'}


@pytest.mark.parametrize('fmt,ext', FORMATS.items())
def test_convert(fmt, ext, tmp_path):
  outbase = os.path.join(tmp_path, 'test_convert')
  outfile = outbase + ext  # ext already has leading dot (e.g. '.html', '.body.tex')

  cmd_list = ['biedit', 'convert', MD_FILE, '-f', fmt, '-o', outbase]
  print(f'Running command: {" ".join(cmd_list)}')
  result = subprocess.run(cmd_list, capture_output=True, text=True, timeout=10)

  assert result.returncode == 0, result.stdout + result.stderr
  assert os.path.exists(outfile), f'Expected output file not found: {outfile}'

  content = open(outfile).read()
  assert NEEDLE in content, f'"{NEEDLE}" not found in {outfile}'

if __name__ == '__main__':
  for fmt, ext in FORMATS.items():
    test_convert(fmt, ext, tmp_path='test_convert')
