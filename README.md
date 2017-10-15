# Mykrobe

Web or [Electron](http://electron.atom.io/) application based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development.

## Install

First, clone the repo then install dependencies.

```
$ yarn
```

## Dependencies

* current version of Imagemagick

	```
	$ brew install imagemagick
	```

* current version of Ghostscript

	```
	$ brew install ghostscript
	```

### Set target

Selects which version of the app you will target for development, test or package. Targets are defined in `/targets.json`

```
$ yarn set-target
```

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

### Browser

This will initially show a 'not found' page while the initial build takes place, after which it will auto-refresh.

```
$ yarn web-dev
```

### Electron

Note the window will not appear until the initial bundle is compiled which can take up to one minute.

```
$ yarn electron-dev
```

## Web production build

```
$ yarn web-build
```

After build, you will find files in `web/build` folder. To run a simple production server:

```
$ yarn web-build-simple-server
```

## Electron production build

1. Install Wine to build Windows app on mac

	```
	$ brew install wine
	```

2. Package

	Build for current platform:

	```
	$ yarn electron-package
	$ yarn electron-dist
	```

	To build apps for all platforms:

	```
	$ yarn electron-package:all
	$ yarn electron-dist:all
	```
3. After build, you will find files in `electron/dist` folder.

## Further Reading

Further information about the app can be found in the following files, located in the `/docs` directory:

- [Coding standards](docs/coding-standards.md)
- [Dependencies](docs/dependencies.md)
- [Testing](docs/testing.md)
- [Electron](docs/electron.md)

## Licenses

The Electron build process is modified from [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate), MIT © [C. T. Lin](https://github.com/chentsulin)
