# Mykrobe Atlas + Predictor

Web or [Electron](http://electron.atom.io/) application based on [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), [React Router](https://github.com/reactjs/react-router), [Webpack](http://webpack.github.io/docs/), [React Transform HMR](https://github.com/gaearon/react-transform-hmr) for rapid application development.

## Install

* Install package manager

	```
	$ brew install yarn
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

## Web version

- See [Run web version](docs/web.md)

## Desktop version

- See [Run desktop version](docs/desktop.md)

## Further Reading

Further information about the app can be found in the following files, located in the `/docs` directory:

- [Coding standards](docs/coding-standards.md)
- [Dependencies](docs/dependencies.md)
- [Testing](docs/testing.md)
- [Building Windows Predictor Binaries](docs/predictor-windows.md)

## Licenses

The build process is modified from [electron-react-boilerplate](https://github.com/chentsulin/electron-react-boilerplate), MIT © [C. T. Lin](https://github.com/chentsulin)
