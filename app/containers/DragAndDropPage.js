import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DragAndDrop from '../components/DragAndDrop';

class DragAndDropPage extends Component {
  render() {
    return (
      <DragAndDrop {...this.props} />
    );
  }
}

export default DragAndDropPage;
