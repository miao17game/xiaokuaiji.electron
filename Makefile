install:
	ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" yarn --registry https://registry.npm.taobao.org

dev-app:
	rm -rf build
	yarn run electron:serve

dev-ng:
	yarn run ng:serve

start:
	rm -rf build
	yarn start

build-local:
	rm -rf build
	yarn run electron:local

build-mac:
	rm -rf build
	yarn run electron:mac

build-win:
	rm -rf build
	yarn run electron:windows