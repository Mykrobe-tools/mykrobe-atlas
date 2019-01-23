# Mykrobe Atlas Testing

## Overview

This app uses the [Jest](http://facebook.github.io/jest/) testing framework.

## Setup

1. Download the large `exemplar_seqeuence_data` fixtures from [here](https://www.dropbox.com/sh/7v8foml90gvqapk/AADiRLFx6PIBjbcavV9Spylwa?dl=0)

2. Move this folder into the project at path `/test/__fixtures__/exemplar_seqeuence_data`

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

Potentially slow tests can check if they should execute by checking the for env variable `process.env.INCLUDE_SLOW_TESTS === 'true'`

Look at the existing tests in the app for examples.

## Debugging tests with Chrome DevTools

To attach Chrome DevTools, open chrome://inspect/#devices then click 'Open dedicated DevTools for node'

```
$ yarn test:debug
```

### Action creators

Test whether an action creator is called, and whether the correct action has been returned.

- http://redux.js.org/docs/recipes/WritingTests.html#action-creators
- http://academy.plot.ly/react/6-testing/#actions

#### Async action creators

If the action creator runs async (e.g. if it returns a _thunk_ function rather than immediately returning an action) the tests may need to create a mock store to test returned actions.

- http://redux.js.org/docs/recipes/WritingTests.html#async-action-creators

### Reducers

Test that the reducer for each action returns the correct state.

- http://redux.js.org/docs/recipes/WritingTests.html#reducers
- http://academy.plot.ly/react/6-testing/#reducer

### Component snapshots

Components should test that they render a consistent interface, and that _UI_ and _state_ interactions complete as expected without side-effects.

Components that don't contain complex interactivity can use jest's _snapshot_ testing facility, which is a simple method of ensuring that they don't contain any unexpected changes.

This can also be used to test whether simple callbacks are called.

On first run, this will create a _snapshot_ directory and file, which will be tested against on future tests. These files should be committed to the repository.

It may be helpful to mock subcomponents to keep tests focused on the component in question.

Snapshot test files should contain the file extension `.snapshot.spec.js` to differentiate them from other component tests.

- https://facebook.github.io/jest/blog/2016/07/27/jest-14.html
- http://facebook.github.io/jest/docs/tutorial-react.html#snapshot-testing
- http://academy.plot.ly/react/6-testing/#component-testing

### Component interactions

To test components with more complex interaction, snapshots don't offer enough flexibility to test effectively.

Instead, use the _enzyme_ utility, which offers the ability to manipulate and traverse around a component.

It can be helpful to create *both enzyme and snapshot* tests for complex components.

- http://redux.js.org/docs/recipes/WritingTests.html#components
- http://airbnb.io/enzyme/

## See next

- [Web version](web.md)
- [Desktop version](desktop.md)
- [Overview](../README.md)