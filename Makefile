install:
	yarn install

publish:
	yarn publish

lint:
	yarn run eslint .

build:
	yarn run build

start:
	yarn run start

deploy:
	yarn run deploy

clear:
	rm -rf dist
	rm -rf node_modules
