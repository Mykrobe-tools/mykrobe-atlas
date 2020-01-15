/* @flow */

import * as React from 'react';
import styles from './PhylogenyWithKey.scss';
import Key from '../ui/header/Key';
import Phylogeny from './Phylogeny';

class PhylogenyWithKey extends React.Component<*> {
  render() {
    return (
      <div className={styles.container}>
        <Key />
        <Phylogeny />
      </div>
    );
  }
}

export default PhylogenyWithKey;
