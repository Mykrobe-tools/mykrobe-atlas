# Mykrobe Desktop

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

> Note the window will not appear until the initial bundle is compiled which can take up to one minute.

```
$ yarn electron-dev
```

## Build Predictor binaries

> Note this currently works on Mac only.

This will checkout or update the latest source from [https://github.com/iqbal-lab/Mykrobe-predictor](https://github.com/iqbal-lab/Mykrobe-predictor), build an executable and copy it into the correct folder for use in the GUI

1. Install dependencies

	```
	$ brew install python
	$ pip install git+https://github.com/Phelimb/atlas
	$ pip install pyinstaller
	```

2. Build for Mac

	```
	$ yarn build-predictor-binaries
	```
	
	Executable will be copied into `/electron/resources/bin/<target>/<platform>/bin` which will in turn be bundled into respective GUI.

## Desktop production build

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
