/* @flow */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

// TODO: push route on state change

class ResistanceClass extends Component {
  render () {
    return (
      <div>
        ResistanceClass
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    analyser: state.analyser
  }
}

ResistanceClass.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default connect(mapStateToProps)(ResistanceClass)
