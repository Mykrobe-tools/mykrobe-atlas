# Mykrobe Desktop Release

This process will need to be followed on each platform - Mac, Windows.

The build and publish process fetches latest Predictor binaries from, and publishes to, the repo specified by `build.publish` in `package.json`, e.g.

```
"build": {
	"publish": {
		"owner": "Mykrobe-tools",
		"repo": "mykrobe"
	},
}
```

publishes to the releases page here: https://github.com/Mykrobe-tools/mykrobe/releases

It will use a release tag from the version specified in `package.json`, e.g.

```
"version": "1.0.7",
```

Will publish against a release with tag `v1.0.7` or create a new draft if one does not exist.

Using these version tags, the desktop app checks for updates automatically on launch and downloads them silently. The user is notified once a new version is ready to install.

## Setup

* Set up [Environment variables](docs/dotenv.md)

## Release a new version

1. Update the version and commit - this sets both the version in the app and the git tag following the format `v0.0.0` where the draft release will be published. Commit hooks are explicitly skipped as at time of writing they may fail when invoked by this command depending on node versions.

	```
	$ yarn version --no-commit-hooks
	```

	Enter new version number when prompted, e.g. `0.6.0`. To push the source changes (do not push the tag yet; it will be created when the draft release is published),

	```
	$ git push origin HEAD
	```

2. Run a complete test

	```
	$ yarn test
	```

3. If the tests pass, publish a draft release.

	```
	$ yarn desktop-package
	$ yarn desktop-dist --publish
	```

	> If you see an error similar to `skipped publishing file=<file> reason=existing type not compatible with publishing type tag=<tag> version=<tag> existingType=release publishingType=draft`, check that the GitHub release you are publishing too is in 'draft' mode and not 'published'

4. Repeat steps 2–4 for each platform

5. Publish the release using GitHub - make sure that 'This is a pre-release' is unchecked or this release will be overlooked by the auto-updater.

## See next

- [Desktop version](desktop.md)
- [Overview](../README.md)
