/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import SearchNavigation from './SearchNavigation';

const onSubmit = q => console.log('onSubmit', q);

const variations = {
  default: {
    title: 'Lorem ipsum',
    placeholder: 'Lorem ipsum',
    onSubmit,
  },
  populated: {
    title: 'Lorem ipsum',
    placeholder: 'Lorem ipsum',
    q: 'Lorem ipsum query',
    onSubmit,
  },
};

storiesOf('SearchNavigation', module)
  .add('Default', () => <SearchNavigation {...variations.default} />)
  .add('Populated', () => <SearchNavigation {...variations.populated} />);
