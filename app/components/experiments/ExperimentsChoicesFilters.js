/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import pluralize from 'pluralize';
import DocumentTitle from 'react-document-title';
import { Button } from 'reactstrap';

import {
  getExperimentsChoices,
  getExperimentsHasDataFilters,
  getExperimentsDataFilters,
  setExperimentsFilters as setFilters,
  resetExperimentsFilters as clearFilters,
  getIsFetchingExperimentsChoices,
  requestExperimentsChoices,
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
