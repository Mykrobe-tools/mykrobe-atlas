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
    analyser: state.analyser
  };
}

SamplePage.propTypes = {
};

export default connect(mapStateToProps)(SamplePage);
