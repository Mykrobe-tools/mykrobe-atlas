/* @flow */

import { connect } from 'react-redux';

import {
  getExperimentsChoices,
  getExperimentsHasChoicesFilters,
  getExperimentsChoicesFilters,
  setExperimentsFilters as setFilters,
  resetExperimentsFilters as clearFilters,
  getIsFetchingExperimentsChoices,
} from '../../modules/experiments';

import ChoicesFilters from '../choicesFilters/ChoicesFilters';

const withRedux = connect(
  state => ({
    isFetching: getIsFetchingExperimentsChoices(state),
    choices: getExperimentsChoices(state),
    hasFilters: getExperimentsHasChoicesFilters(state),
    filters: getExperimentsChoicesFilters(state),
  }),
  {
    setFilters,
    clearFilters,
  }
);

export default withRedux(ChoicesFilters);
