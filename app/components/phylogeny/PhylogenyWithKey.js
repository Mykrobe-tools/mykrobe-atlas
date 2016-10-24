/* @flow */

import React, { Component} from 'react';
import styles from './PhylogenyWithKey.css';
import Key from 'components/header/Key';
import Phylogeny from './Phylogeny';

class PhylogenyWithKey extends Component {
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
