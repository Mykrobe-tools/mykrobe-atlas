# Mykrobe Atlas Desktop

## Setup

1. Fetch latest Predictor binaries

	$ yarn fetch-predictor-binaries

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

	$ yarn desktop-dev

After you see `Compiled successfully` in the terminal window, you may reload the view (Menu: View → Reload) in Electron to see the app.

To debug the main process, open Chrome app and visit [chrome://inspect/#devices](chrome://inspect/#devices). Ensure that you have `localhost:5858` included in the 'Discover network targets'.

Main process log file on macOS is `~/Library/Logs/Mykrobe/log.log`

## Run production version

* `desktop-package` builds and packages a standalone app inside the `desktop/releases` folder. At this stage the app is a folder full of files.

* `desktop-dist [--skip-notarize]` takes the folder(s) created by `desktop-package` and combines into single individual self-contained apps / images / installers for specified platforms, signed and ready for distribution. Add `--skip-notarize` to skip the Mac notiarize step.

### Debug production version

- See [Environment variables](dotenv.md)

### Production build for current platform

	$ yarn desktop-package
	$ yarn desktop-dist

After build, you will find files in `desktop/dist` folder.

## See next

- [Desktop release](desktop-release.md)
- [Desktop icons](desktop-icons.md)
- [Overview](../README.md)