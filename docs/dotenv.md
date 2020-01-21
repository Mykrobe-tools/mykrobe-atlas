# Mykrobe Environment Variables

The following variables should be set in the build environment or in the `.env` file at the root of the project. The `.env` file is excluded from source control by default and should not be committed.

## Debugging

### DEBUG_PRODUCTION

Set `DEBUG_PRODUCTION=1` to enable the Chrome Debugger and `console` in the production build. Should be disabled for a release.

Default off `DEBUG_PRODUCTION=0`

## Windows or macOS Desktop app

### GH_TOKEN

Required if you want to work with the desktop app or deploy releases to GitHub. Used to communicate with the GitHub API.

* GitHub personal access token is required. You can generate by going to [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new). The access token should have the *repo* scope/permission.
* e.g. `GH_TOKEN=abc123`

## macOS sign and Notarize

Required if you want to create a release build of the desktop app for macOS. Used to digitally sign the app and notarize it with Apple.

### MAC_NOTARIZE_APPLE_ID

* The Apple ID of the signing account
* e.g. `MAC_NOTARIZE_APPLE_ID=demo@example.com`

### MAC_NOTARIZE_APPLE_ID_PASSWORD

* The password or Keychain item identifier of the signing account
* e.g. `MAC_NOTARIZE_APPLE_ID_PASSWORD=@keychain:Application Loader: demo@example.com`

### MAC_NOTARIZE_ASC_PROVIDER

* This is the `ProviderShortname` which can be found by running the following with the credentials referenced above;

	```
	$ xcrun altool --list-providers -u 'demo@example.comm' -p @keychain:"Application Loader: demo@example.com"
	```

* e.g. `MAC_NOTARIZE_ASC_PROVIDER=ABC123`

## See next

- [Web version](docs/web.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)