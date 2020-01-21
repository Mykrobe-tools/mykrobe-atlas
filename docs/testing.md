# Mykrobe Atlas Testing

## Overview

This app uses the [Jest](http://facebook.github.io/jest/) testing framework.

## Setup

1. Download the large `exemplar_seqeuence_data` fixtures from [here](https://www.dropbox.com/sh/7v8foml90gvqapk/AADiRLFx6PIBjbcavV9Spylwa?dl=0)

2. Move this folder into the project (or create a symbolic link) at path `/test/__fixtures__/exemplar_seqeuence_data`

3. Set up environemt variables in `.env`

   ```
   DEBUG_PRODUCTION=0
   ```

## Run tests

This project has the concept of 'fast' and 'slow' (default) tests. Typically these are tests which involve analysing a sample or compiling the app and may take several minutes to complete.

To run the general test suite, skipping slow tests:

```
$ yarn test:fast
```

To run all tests including slow ones:

```
$ yarn test
```

To run an individual test

```
$ yarn test -t 'AnalyserLocalFile'
```

To run just end-to-end tests

```
$ yarn test:e2e
```

## Creating tests

Tests should be placed alongside the files that they are testing, with the extension `.test.js` appended to their filename.

Potentially slow tests can use the `util` functions `describeSlowTest` etc. Look at the existing tests in the app for examples.

## Debugging tests with Chrome DevTools

To attach Chrome DevTools, open [chrome://inspect/#devices](chrome://inspect/#devices) then click 'Open dedicated DevTools for node'

```
$ yarn test:debug
```

## See next

- [Web version](web.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)