# Mykrobe Desktop

## Setup

1. Select a *Predictor* target – [About targets](targets.md)

	```
	$ yarn set-target
	```

2.	[Build Predictor Binaries](desktop-predictor-binaries.md) – The desktop app requires a local executable version of Predictor

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

```
$ yarn desktop-dev
```

You will see `Failed to load resource: net::ERR_CONNECTION_REFUSED` in the Electron window while the app compiles.

After you see `webpack: Compiled successfully` in the terminal window, you may reload the view (Menu: View → Reload) in Electron to see the app.

## Run production version

* `desktop-package` builds and packages a standalone app inside the `desktop/releases` folder. At this stage the app is a folder full of files.

* `desktop-dist` takes the folder(s) created by `desktop-package` and combines into single individual self-contained apps / images / installers for specified platforms, signed and ready for distribution.

### Production build for current platform

```
$ yarn desktop-package
$ yarn desktop-dist
```

After build, you will find files in `desktop/dist` folder.

## See next

- [Desktop release](desktop-release.md)
- [Desktop icons](desktop-icons.md)
- [Overview](../README.md)