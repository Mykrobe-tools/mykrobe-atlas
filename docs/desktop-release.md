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

- Set up [Environment variables](docs/dotenv.md)

- Install Wine to build Windows

      	```
      	$ brew install wine-stable
      	```

## Release a new version

1. Update the version in `package.json` to match the draft release - e.g. if the GitHub release tag is `v1.0.7` then change the version in `package.json` to `1.0.7`

2. Run a complete test

   ```
   $ yarn test
   ```

3. If the tests pass, publish a draft release for all configured platforms.

   ```
   $ yarn desktop-package --all
   $ yarn desktop-dist --all --publish
   ```

   > If you see an error similar to `skipped publishing file=<file> reason=existing type not compatible with publishing type tag=<tag> version=<tag> existingType=release publishingType=draft`, check that the you updated the version in `package.json` and that the GitHub release you are publishing too is in 'draft' mode and not 'published'

4. Publish the release using GitHub - make sure that 'This is a pre-release' is unchecked or this release will be overlooked by the auto-updater.

## See next

- [Desktop version](desktop.md)
- [Overview](../README.md)
