/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import CircularProgress from './CircularProgress';

storiesOf('CircularProgress', module)
  .add('0%', () => <CircularProgress percentage={0} />)
  .add('10%', () => <CircularProgress percentage={10} />)
  .add('20%', () => <CircularProgress percentage={20} />)
  .add('30%', () => <CircularProgress percentage={30} />)
  .add('40%', () => <CircularProgress percentage={40} />)
  .add('50%', () => <CircularProgress percentage={50} />)
  .add('60%', () => <CircularProgress percentage={60} />)
  .add('70%', () => <CircularProgress percentage={70} />)
  .add('80%', () => <CircularProgress percentage={80} />)
  .add('90%', () => <CircularProgress percentage={90} />)
  .add('100%', () => <CircularProgress percentage={100} />);
