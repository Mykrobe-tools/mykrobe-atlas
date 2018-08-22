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
    size: 'sm',
    setFilters,
    clearFilters,
    filters: {},
    choicesFilters: {},
    choices: {},
  },
  default: {
    size: 'sm',
    setFilters,
    clearFilters,
    filters: {},
    choicesFilters: {},
    choices,
  },
  filters1: {
    size: 'sm',
    setFilters,
    clearFilters,
    filters: {
      'metadata.phenotyping.gatifloxacin.method': 'Microtitre plate',
    },
    choicesFilters: {
      'metadata.phenotyping.gatifloxacin.method': 'Microtitre plate',
    },
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
    return (
      <ChoicesFilters
        filters={filters}
        choicesFilters={filters}
        clearFilters={this.clearFilters}
        setFilters={this.setFilters}
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
    <ChoicesFiltersPreservingFilters
      size="sm"
      choices={variations.default.choices}
    />
  ))
  .add('Empty', () => <ChoicesFilters {...variations.empty} />);
