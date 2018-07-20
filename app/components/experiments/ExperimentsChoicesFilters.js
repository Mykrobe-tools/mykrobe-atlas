/* @flow */

import { connect } from 'react-redux';

import {
  getExperimentsChoices,
  getExperimentsHasDataFilters,
  getExperimentsDataFilters,
  setExperimentsFilters as setFilters,
  resetExperimentsFilters as clearFilters,
  getIsFetchingExperimentsChoices,
} from '../../modules/experiments';

import ChoicesFilters from '../choicesFilters/ChoicesFilters';

const withRedux = connect(
  state => ({
    isFetching: getIsFetchingExperimentsChoices(state),
    choices: getExperimentsChoices(state),
    hasFilters: getExperimentsHasDataFilters(state),
    filters: getExperimentsDataFilters(state),
  }),
  {
    setFilters,
    clearFilters,
  }
);

export default withRedux(ChoicesFilters);
