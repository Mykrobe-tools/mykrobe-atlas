/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import _ from 'lodash';

import ChoicesFilters from './ChoicesFilters';

const setFilters = filters => {
  console.log('setFilters called:', JSON.stringify(filters, null, 2));
};
const clearFilters = () => {
  console.log('resetFilters called');
};

const choices = require('./__fixtures__/choices');

const variations = {
  empty: {
    setFilters,
    clearFilters,
    filters: {},
    choicesFilters: {},
    choices: {},
  },
  default: {
    setFilters,
    clearFilters,
    filters: {},
    choicesFilters: {},
    choices,
  },
  filters1: {
    setFilters,
    clearFilters,
    filters: {
      'metadata.phenotyping.gatifloxacin.method': 'Microtitre plate',
    },
    choicesFilters: {
      'metadata.phenotyping.gatifloxacin.method': 'Microtitre plate',
    },
    hasFilters: true,
    choices,
  },
};

type State = {
  filters: any,
};

class ChoicesFiltersPreservingFilters extends React.Component<*, State> {
  state = {
    filters: {},
  };

  clearFilters = () => {
    this.setState({
      filters: {},
    });
  };

  setFilters = filters => {
    const cleanFilters = _.omitBy(filters, _.isNil);
    this.setState({
      filters: cleanFilters,
    });
  };

  render() {
    const { filters: discardedFilters, ...rest } = this.props; // eslint-disable-line
    const { filters } = this.state;
    const hasFilters = Object.keys(filters).length > 0;
    return (
      <ChoicesFilters
        filters={filters}
        choicesFilters={filters}
        clearFilters={this.clearFilters}
        setFilters={this.setFilters}
        hasFilters={hasFilters}
        {...rest}
      />
    );
  }
}

storiesOf('ChoicesFilters', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('Default', () => <ChoicesFilters {...variations.default} />)
  .add('Filters 1', () => <ChoicesFilters {...variations.filters1} />)
  .add('Preserve Filters', () => (
    <ChoicesFiltersPreservingFilters choices={variations.default.choices} />
  ))
  .add('Empty', () => <ChoicesFilters {...variations.empty} />);
