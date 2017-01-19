/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';

class LibraryPage extends Component {
  render() {
    return (
      <div>
        LibraryPage
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

LibraryPage.propTypes = {
};

export default connect(mapStateToProps)(LibraryPage);
