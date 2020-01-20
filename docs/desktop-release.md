# Mykrobe Desktop

## Setup

1. Set up [Environment variables](docs/dotenv.md)

## Release a new version

This process will need to be followed on each platform - Mac, Windows. The desktop app checks for updates automatically on launch and downloads them silently. The user is notified once a new version is ready to install.

1. Set the desired target – [About targets](targets.md)

	```
	$ yarn set-target
	```

2. Update the version and commit - this sets both the version in the app and the git tag following the format `v0.0.0` where the draft release will be published. Commit hooks are explicitly skipped as at time of writing they may fail when invoked by this command depending on node versions.

	```
	$ yarn version --no-commit-hooks
	```

	Enter new version number when prompted, e.g. `0.6.0`. To push the source changes (do not push the tag yet; it will be created when the draft release is published),

	```
	$ git push origin HEAD
	```

3. Run a complete test

	```
	$ yarn test
	```

4. If the tests pass, publish a draft release to the repo specified by `build.publish` in `package.json`

	```
	$ yarn desktop-package
	$ yarn desktop-dist --publish
	```

	> If you see an error similar to `skipped publishing file=<file> reason=existing type not compatible with publishing type tag=<tag> version=<tag> existingType=release publishingType=draft`, check that the GitHub release you are publishing too is in 'draft' mode and not 'published'

5. Repeat steps 3–5 for each platform

6. Publish the release using GitHub - make sure that 'This is a pre-release' is unchecked or this release will be overlooked by the auto-updater.

## See next

- [Desktop version](desktop.md)
- [Overview](../README.md)
