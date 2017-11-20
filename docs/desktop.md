# Mykrobe Desktop

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

```
$ yarn electron-dev
```

You will see `Failed to load resource: net::ERR_CONNECTION_REFUSED` in the Electron window while the app compiles.

After you see `webpack: Compiled successfully` in the terminal window, you may reload the view (View > Reload) in Electron to see the app.

## Build Predictor binaries

This will checkout or update the latest source from [https://github.com/iqbal-lab/Mykrobe-predictor](https://github.com/iqbal-lab/Mykrobe-predictor), build an executable and copy it into the correct folder for use in the GUI

### Mac 64-bit

1. Install dependencies

	```
	$ brew install python
	$ pip install git+https://github.com/Phelimb/atlas
	$ pip install pyinstaller
	```

2. Build from within the root of the project

	```
	$ yarn build-predictor-binaries
	```

### Windows 64-bit

1. Setup environment

	- Install [NodeJS](https://nodejs.org/dist/v8.9.1/node-v8.9.1-x64.msi)
	- Install [Yarn](https://yarnpkg.com/latest.msi)
	- Install [Cygwin64](https://www.cygwin.com/setup-x86_64.exe) with the following packages:

		- gcc-core
		- gcc-g++
		- git
		- make
		- zlib-devel
		- python2-devel

2. Launch Cygwin64 and setup the user
 		
	- Copy or create ssh keys for Cygwin in `/cygwin64/home/IEUser/.ssh`
	
3. Install dependencies
	
	```
	$ python -m ensurepip
	$ pip install git+https://github.com/Phelimb/atlas
	$ pip install pyinstaller==3.2.1
	```

4. Build from within the root of the project

	```
	$ yarn build-predictor-binaries
	```

### Windows and Mac
	
Executable will be copied into `/electron/resources/bin/<target>/<platform>/bin` which will in turn be bundled into respective GUI.

## Desktop production build

1. Install Wine to build Windows app on mac

	```
	$ brew install wine
	```

2. Package for distribution

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

## Publish desktop production build

As above and append `--publish` after `yarn electron-dist:`

## Generate icons

This will rebuild dekstop app icon files from the master artwork

* Install dependencies

	```
	$ brew install imagemagick
	$ brew install ghostscript
	```
	
* Generate icons

	```
	$ yarn generate-icons
	```