import React, { Component } from 'react';
import Results from 'components/Results';

export default class ResultsPage extends Component {
  render() {
    return (
      <Results {...this.props} />
    );
  }
}
