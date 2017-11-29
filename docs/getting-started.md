# Getting started

## Install

* Install package manager

	```
	$ brew install yarn
	```

* If using `nvm`, set the Node version

	```
	$ nvm use
	```

* Install dependencies

	```
	$ yarn
	```

## Select the target

Selects which version of the app (Atlas, Predictor, TB etc.) you will target for development, test or package. Targets are defined in `/targets.json`. This works by modifying several files and will persist when committed to source control.

```
$ yarn set-target
```

## See next

- [Web version](web.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)