import React, { Component } from 'react';
import Predictor from 'components/predictor/Predictor';

export default class PredictorPage extends Component {
  render() {
    return (
      <Predictor {...this.props} />
    );
  }
}
