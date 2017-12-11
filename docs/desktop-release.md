# Mykrobe Desktop

## Setup

Set up deployment to GitHub releases

1. GitHub personal access token is required. You can generate by going to [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new). The access token should have the *repo* scope/permission.

2. Set this as the environment variable `GH_TOKEN`

3. Publish a draft release to the repo specified by `build.publish` in `package.json`

	```
	$ yarn desktop-dist --publish
	```

## Release a new version

This process will need to be followed on each platform - Mac, Windows. The desktop app checks for updates automatically on launch and downloads them silently. The user is notified once a new version is ready to install.

1. Update the version and commit - this sets both the version in the app and the git tag following the format `v0.0.0` where the draft release will be published

	```
	$ yarn version
	$ git push origin HEAD
	```

2. Build the latest Predictor binaries (see [Build Predictor Binaries](desktop-predictor-binaries.md) for setup instructions)


	```
	$ yarn build-predictor-binaries
	```

3. Run a complete test

	```
	$ yarn test
	```

4. If the tests pass, publish a draft release

	```
	$ yarn desktop-package
	$ yarn desktop-dist --publish
	```

5. Repeat steps 2–4 for each platform

6. Publish the release using GitHub - make sure that 'This is a pre-release' is unchecked or this release will be overlooked by the auto-updater.

## License agreement

The EULA located in `/desktop/resources/build` is displayed to the user as part of installation.

## See next

- [Desktop version](desktop.md)
- [Overview](../README.md)