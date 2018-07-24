/* @flow */

import * as React from 'react';
import Empty from '../../../ui/Empty';

class ResistanceEmpty extends React.Component<*> {
  render() {
    return (
      <Empty
        title={'No Resistance Profile'}
        subtitle={'The analysis has no resistance profile'}
      />
    );
  }
}

export default ResistanceEmpty;
