/* @flow */

import React, { Component, PropTypes } from 'react'
import Results from '../components/Results'
import { connect } from 'react-redux'
import * as AnalyserActions from '../actions/AnalyserActions'

class ResultsPage extends Component {
  componentDidMount () {
    const {dispatch, analyser} = this.props
    if (!analyser.file) {
      dispatch(AnalyserActions.analyseFileCancel())
    }
  }

  render () {
    return (
      <Results {...this.props} />
    )
  }
}

function mapStateToProps (state) {
  return {
    analyser: state.analyser
  }
}

ResultsPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(ResultsPage)
