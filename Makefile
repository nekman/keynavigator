test: 
	jasmine-node test --verbose

minify: 
	uglifyjs2 -o keynavigator-min.js keynavigator.js --comments '/plugin/'

all: test minify

.PHONY: test minify