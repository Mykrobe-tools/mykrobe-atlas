# Mykrobe Environment Variables

The following variables should be set in the build environment or in the `.env` file at the root of the project. The `.env` file is excluded from source control by default and should not be committed.

## API Health check

### `REACT_APP_API_HEALTH_CHECK_URL`

* This url will be called with a `HEAD` request periodically to check connectivity. On timeout the user will be notified that there is a connectivity problem.
* The client tries again periodically with  exponential backoff + randomness.
* Defaults to `${REACT_APP_API_URL}/health-check`

### `REACT_APP_API_HEALTH_CHECK_TIMEOUT`

* The initial timeout after which to trigger a connectivity warning, defaults to 30000 milliseconds.

### `REACT_APP_API_HEALTH_CHECK_INTERVAL`

* How frequently to check, defaults to 10000 milliseconds

## Crash telemetry

Production bundle of the web client may be configured to use Sentry to collect crash logs

### `REACT_APP_SENTRY_PUBLIC_DSN`

* This is used by the running app to send events to Sentry

### `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`

* Used during `yarn web-build` to upload source maps to Sentry so that any crashses can be traced back to source code.
* `SENTRY_AUTH_TOKEN` can be created at [https://sentry.io/settings/account/api/auth-tokens/](https://sentry.io/settings/account/api/auth-tokens/)


## Debugging

### `DEBUG_PRODUCTION`

* Set `DEBUG_PRODUCTION=1` to enable the Chrome Debugger and `console` in the production build. Should be disabled for a release.
* Default off `DEBUG_PRODUCTION=0`

## Windows or macOS Desktop app

### `GH_TOKEN`

* Required if you want to work with the desktop app or deploy releases to GitHub. Used to communicate with the GitHub API.
* GitHub personal access token is required. You can generate by going to [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new). The access token should have the *repo* scope/permission.
* e.g. `GH_TOKEN=abc123`

## macOS sign and Notarize

Required if you want to create a release build of the desktop app for macOS. Used to digitally sign the app and notarize it with Apple.

### `MAC_NOTARIZE_APPLE_ID`

* The Apple ID of the signing account
* e.g. `MAC_NOTARIZE_APPLE_ID=demo@example.com`

### `MAC_NOTARIZE_APPLE_ID_PASSWORD`

* The password or Keychain item identifier of the signing account
* e.g. `MAC_NOTARIZE_APPLE_ID_PASSWORD=@keychain:Application Loader: demo@example.com`

### `MAC_NOTARIZE_ASC_PROVIDER`

* This is the `ProviderShortname` which can be found by running the following with the credentials referenced above;

	```
	$ xcrun altool --list-providers -u 'demo@example.comm' -p "@keychain:Application Loader: demo@example.com"
	```

* e.g. `MAC_NOTARIZE_ASC_PROVIDER=ABC123`

## See next

- [Web version](docs/web.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)