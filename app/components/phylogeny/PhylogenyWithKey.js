/* @flow */

import * as React from 'react';
import styles from './PhylogenyWithKey.css';
import Key from '../header/Key';
import Phylogeny from './Phylogeny';

class PhylogenyWithKey extends React.Component {
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
