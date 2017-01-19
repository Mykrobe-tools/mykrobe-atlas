/* @flow */

import React, { Component } from 'react';
import Sample from '../components/sample/Sample';
import { connect } from 'react-redux';

class SamplePage extends Component {
  render() {
    return (
      <Sample {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

SamplePage.propTypes = {
};

export default connect(mapStateToProps)(SamplePage);
