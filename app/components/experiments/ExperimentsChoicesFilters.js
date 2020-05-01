/* @flow */

import { connect } from 'react-redux';

import {
  getExperimentsChoices,
  getExperimentsHasChoicesFilters,
  getExperimentsChoicesFilters,
  getExperimentsFilters,
  setExperimentsFilters as setFilters,
  resetExperimentsFilters as clearFilters,
  getIsFetchingExperimentsChoices,
} from '../../modules/experiments';

import ChoicesFilters from 'makeandship-js-common/src/components/choicesFilters';

const withRedux = connect(
  (state) => ({
    isFetching: getIsFetchingExperimentsChoices(state),
    choices: getExperimentsChoices(state),
    filters: getExperimentsFilters(state),
    hasFilters: getExperimentsHasChoicesFilters(state),
    choicesFilters: getExperimentsChoicesFilters(state),
  }),
  {
    setFilters,
    clearFilters,
  }
);

export default withRedux(ChoicesFilters);
