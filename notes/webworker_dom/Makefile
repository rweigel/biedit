
all:
	npm install --save-dev -g xmldom
	npm install --save-dev -g browserify
	browserify domparser.js --s xmldom > domparser_browserfied.js

test:
	python -m http.server 8001