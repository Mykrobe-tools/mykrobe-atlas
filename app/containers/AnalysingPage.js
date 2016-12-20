/* @flow */

import React, { Component } from 'react';
import Analysing from '../components/analysing/Analysing';

export default class AnalysingPage extends Component {
  render() {
    return (
      <Analysing {...this.props} />
    );
  }
}
