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

2. Package and distribute

	`electron-package` builds and packages a standalone app inside the `electroon/releases` folder. At this stage the app is a folder full of files.
	
	`electron-dist` takes the folder(s) created by `electron-package` and combines into single individual self-contained apps / images / installers for specified platforms, signed and ready for distribution.

	Build for current platform:

	```
	$ yarn electron-package
	$ yarn electron-dist
	```
	
	Build for single Windows platform:

	```
	$ yarn electron-package:win
	$ yarn electron-dist:win
	```

	To build apps for all platforms:

	```
	$ yarn electron-package:all
	$ yarn electron-dist:all
	```
	
3. After build, you will find files in `electron/dist` folder.

## Electron - Predictor binaries

1. Install Wine to build Windows app on Mac

	```
	$ brew install wine
	$ brew install winetricks
	```
	
2. Download and install Python on Wine

	```
	$ curl -O https://www.python.org/ftp/python/2.7.10/python-2.7.10.msi
	$ wine msiexec /i python-2.7.10.msi /L*v log.txt
	```
	
3. Install PyInstaller on Wine

	```
	$ cd ~/.wine/drive_c/Python27
	$ wine python.exe Scripts/pip.exe install pyinstaller
	```

4. Install git on Wine

	```
	$ # set to Vista
	$ winecfg
	$ curl -OL https://github.com/git-for-windows/git/releases/download/v2.14.2.windows.3/Git-2.14.2.3-32-bit.exe
	$ wine Git-2.14.2.3-32-bit.exe
	```
	
5. Install atlas on Wine

	```
	$ pip install git+https://github.com/Phelimb/atlas
	```
	
	> At present this fails with lots of errors, presumably resulting in the error folowing;
	
6. Build from inside 'dist' folder

	```
	$ # <cd dist>
	$ wine ~/.wine/drive_c/Python27/Scripts/pyinstaller.exe --noconfirm --workpath='./pyinstaller_build/binary_cache' --distpath='./pyinstaller_build' mykrobe_predictor_pyinstaller.spec
	```
	
	> At present this compiled binary fails with error 
	> 'File "Mykrobe-predictor\mykrobe\mykrobe_predictor.py", line 17, in <module>ImportError: No module named mykatlas.base'

## Further Reading

Further information about the app can be found in the following files, located in the `/docs` directory:

- [Coding standards](docs/coding-standards.md)
- [Dependencies](docs/dependencies.md)
- [Testing](docs/testing.md)
- [Electron](docs/electron.md)

## Licenses

The Electron build process is modified from [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate), MIT © [C. T. Lin](https://github.com/chentsulin)
