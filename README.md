# Mykrobe

[Electron](http://electron.atom.io/) application based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development. Modified from [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate)

## Install

First, clone the repo then install dependencies.

```bash
$ npm install
```

## Set target

Selects which version of the app you will target for development, test or package. Targets are defined in `/targets.json`

```bash
$ npm run set-target
```

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

```bash
$ npm run dev
```

## DevTools

#### Toggle Chrome DevTools

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

#### DevTools extension

This boilerplate is included following DevTools extensions:

* [Devtron](https://github.com/electron/devtron) - Install via [electron-debug](https://github.com/sindresorhus/electron-debug).
* [React Developer Tools](https://github.com/facebook/react-devtools) - Install via [electron-devtools-installer](https://github.com/GPMDP/electron-devtools-installer).
* [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) - Install via [electron-devtools-installer](https://github.com/GPMDP/electron-devtools-installer).

You can find the tabs on Chrome DevTools.

If you want to update extensions version, please set `UPGRADE_EXTENSIONS` env, just run:

```bash
$ UPGRADE_EXTENSIONS=1 npm run dev

# For Windows
$ set UPGRADE_EXTENSIONS=1 && npm run dev
```

## Externals

If you use any 3rd party libraries which can't be built with webpack, you must list them in your `webpack.config.base.js`：

```javascript
externals: [
  // put your node 3rd party libraries which can't be built with webpack here 
  // (mysql, mongodb, and so on..)
]
```

You can find those lines in the file.


## CSS Modules

This boilerplate out of the box is configured to use [css-modules](https://github.com/css-modules/css-modules).

All `.css` file extensions will use css-modules unless it has `.global.css`.

If you need global styles, stylesheets with `.global.css` will not go through the
css-modules loader. e.g. `app.global.css`

## Generate app icons

Takes the master PDF artwork from `/resources/icon` and generates Mac and Windows icons.

```bash
$ npm run set-target
```

### Dependencies

* current version of Imagemagick 

	```
	$ brew install imagemagick
	```

* current version of Ghostscript 

	```
	$ brew install ghostscript
	```



## Build for deployment

```bash
$ npm run package
```

To package apps for all platforms:

1. Install Wine to build Windows app on mac

	```
	$ brew install wine
	```
2. Package

	```bash
	$ npm run package-all
	```

3. After build, you will find them in `release` folder. Otherwise, you will only find one for your os.

> **Note:** `test`, `tools`, `release` folder and devDependencies in `package.json` will be ignored by default.


## Licenses

The build process is modified from electron-react-boilerplate, MIT © [C. T. Lin](https://github.com/chentsulin)
