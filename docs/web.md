# Mykrobe Web

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

### Browser

This will initially show a 'not found' page while the initial build takes place, after which it will auto-refresh.

```
$ yarn web-dev
```

## Web production build

```
$ yarn web-build
```

After build, you will find files in `web/build` folder. To run a simple production server:

```
$ yarn web-build-simple-server
```
