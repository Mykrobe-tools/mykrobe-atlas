# Mykrobe Atlas Web

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

## Deploy development version

Merge and push branch `release/dev` - this will deploy to https://dev.mykro.be/

### See deploy progres and status in Google Cloud Platform

https://console.cloud.google.com/cloud-build/builds

Select the Organisation (No Organization for Atlas) and Project (Atlas) first, then type one of those into the search bar

- Trigger (Cloud Build) - Sets up listeners
- History (Cloud Build) - See your builds running
- Container Register - See the build docker image

## See next

- [Run tests](docs/testing.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)
