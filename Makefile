install:
	yarn install

publish:
	yarn publish

lint:
	yarn run eslint .

test:
	yarn run test

test.watch:
	yarn run test --watch

build:
	yarn run build

start:
	yarn run start

deploy:
	yarn run deploy

clear:
	rm -rf dist
	rm -rf node_modules
