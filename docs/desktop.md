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


`electron-package` builds and packages a standalone app inside the `electroon/releases` folder. At this stage the app is a folder full of files.

`electron-dist` takes the folder(s) created by `electron-package` and combines into single individual self-contained apps / images / installers for specified platforms, signed and ready for distribution.

Build for current platform:

```
$ yarn electron-package
$ yarn electron-dist
```

After build, you will find files in `electron/dist` folder.

## Set the version

This will set the app version and a Git tag will be created default following the format `v0.0.0`

```
$ yarn version
```

> Note this can be a little slow - be patient

## Setup deployment to GitHub releases

1. GitHub personal access token is required. You can generate by going to [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new). The access token should have the *repo* scope/permission.

2. Set this as the environment variable `GH_TOKEN`

3. Publish a draft release to the repo specified by `build.publish` in `package.json`

	```
	$ yarn electron-dist --publish
	```

## Release a new version

This process will need to be followed on each platform - Mac, Windows. The desktop app checks for updates automatically on launch and downloads them silently. The user is notified once a new version is ready to install.

1. Update the version and commit - this sets both the version in the app and the git tag where the draft release will be published

	```
	$ yarn version
	$ git push origin HEAD
	```

2. Build the latest Predictor binaries (see initial setup steps above)

	```
	$ yarn build-predictor-binaries
	```

3. Run a complete test

	```
	$ yarn test
	```
	
4. If the tests pass, publish a draft release

	```
	$ yarn electron-package
	$ yarn electron-dist --publish
	```
	
5. Repeat steps 2–4 for each platform

6. Publish the release using GitHub - make sure that 'This is a pre-release' is unchecked or this release will be overlooked by the auto-updater.

## Generate icons

This will rebuild desktop app icon files from the master artwork

* Install dependencies

	```
	$ brew install imagemagick
	$ brew install ghostscript
	```
	
* Generate icons

	```
	$ yarn generate-icons
	```