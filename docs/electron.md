# Electron development

To build the Electron dev version:

```
$ npm run electron-dev
```

#### Toggle Chrome DevTools

- OS X: `Cmd Alt I` or `F12`
- Linux: `Ctrl Shift I` or `F12`
- Windows: `Ctrl Shift I` or `F12`

*See [electron-debug](https://github.com/sindresorhus/electron-debug) for more information.*

#### DevTools extension

This boilerplate is included following DevTools extensions:

* [Devtron](https://github.com/electron/devtron) - Install via [electron-debug](https://github.com/sindresorhus/electron-debug).
* [React Developer Tools](https://github.com/facebook/react-devtools) - Install via [electron-devtools-installer](https://github.com/GPMDP/electron-devtools-installer).
* [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) - Install via [electron-devtools-installer](https://github.com/GPMDP/electron-devtools-installer).

You can find the tabs on Chrome DevTools.

If you want to update extensions version, please set `UPGRADE_EXTENSIONS` env, just run:

```
$ UPGRADE_EXTENSIONS=1 npm run dev

# For Windows
$ set UPGRADE_EXTENSIONS=1 && npm run dev
```

#### Electron Externals

If you use any 3rd party libraries which can't be built with webpack, you must list them in your `webpack.config.base.js`：

```javascript
externals: [
  // put your node 3rd party libraries which can't be built with webpack here
  // (mysql, mongodb, and so on..)
]
```

You can find those lines in the file.


#### Electron generate app icons

Takes the master PDF artwork from `electron/resources/icon` and generates Mac and Windows icons.

```
$ npm run generate-icons
```
