/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import SearchNavigation from './SearchNavigation';

const onSubmit = (q) => console.log('onSubmit', q);

const variations = {
  default: {
    title: 'Lorem ipsum',
    placeholder: 'Lorem ipsum',
    onSubmit,
  },
  transparent: {
    title: 'Lorem ipsum',
    placeholder: 'Lorem ipsum',
    onSubmit,
    transparent: true,
  },
  populated: {
    title: 'Lorem ipsum',
    placeholder: 'Lorem ipsum',
    q: 'Lorem ipsum query',
    onSubmit,
  },
};

storiesOf('ui/SearchNavigation', module)
  .add('Default', () => <SearchNavigation {...variations.default} />)
  .add('Transparent', () => <SearchNavigation {...variations.transparent} />)
  .add('Populated', () => <SearchNavigation {...variations.populated} />);
