# Mykrobe Web

## Setup

Select an *Atlas* target

```
$ yarn set-target
```

## Run development version

This will launch a local dev server and instance of the app. This has DevTools enabled and supports hot (live) reloading of modified files.

This will initially show a 'not found' page while the initial build takes place, after which it will auto-refresh.

```
$ yarn web-dev
```

## Run production version

```
$ yarn web-build
```

After build, you will find files in `web/build` folder. To run a simple production server:

```
$ yarn web-build-simple-server
```

## Deploy production version

> TODO: This will most likely be by merging into a specific branch

## See next

- [Run tests](docs/testing.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)