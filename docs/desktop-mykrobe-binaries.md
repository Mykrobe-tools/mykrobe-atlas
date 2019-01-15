# Mykrobe Desktop

## Build Mykrobe binaries

This will checkout or update the latest source from [https://github.com/iqbal-lab/Mykrobe-predictor](https://github.com/iqbal-lab/Mykrobe-predictor), build an executable and copy it into the correct folder for use in the GUI

## Setup

* SSH access to GitHub is required - see [Connecting to GitHub with SSH](https://help.github.com/articles/connecting-to-github-with-ssh/)

### Mac 64-bit

1. This assumes stock Python 2 and will not work with Python 3. You may experience build issues if using pyenv or similar.

2. Install dependencies

	```
	$ brew install python
	$ pip install git+https://github.com/Phelimb/atlas
	$ pip install pyinstaller
	```

3. Build from within the root of the project

	```
	$ yarn build-mykrobe-binaries
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
	$ yarn build-mykrobe-binaries
	```

### Windows and Mac

Executable will be copied into `/desktop/resources/bin/<target>/<platform>/bin` which will in turn be bundled into respective GUI.

## See next

- [Desktop version](desktop.md)
- [Overview](../README.md)