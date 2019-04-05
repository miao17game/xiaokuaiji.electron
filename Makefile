install:
	ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" yarn --registry https://registry.npm.taobao.org

dev-app:
	rm -rf build
	yarn run electron:serve

dev-ng:
	yarn run ng:serve

start:
	yarn run build:dev && npx electron ./main.js

build-local:
	yarn run electron:local

build-mac:
	yarn run electron:mac