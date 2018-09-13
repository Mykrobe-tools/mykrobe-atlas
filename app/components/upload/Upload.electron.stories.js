/* @flow */

import * as React from 'react';
import { storiesOf } from '@storybook/react';

import Upload from './Upload.electron';

storiesOf('Upload.electron', module)
  .addDecorator(story => (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100vh',
        height: '100vh',
      }}
    >
      {story()}
    </div>
  ))
  .add('20%', () => <Upload isAnalysing progress={20} />)
  .add('40%', () => <Upload isAnalysing progress={40} />)
  .add('60%', () => <Upload isAnalysing progress={60} />)
  .add('80%', () => <Upload isAnalysing progress={80} />)
  .add('100%', () => <Upload isAnalysing progress={100} />);
