/* @flow */

import React, { Component, PropTypes } from 'react'

import styles from './Notification.css'

class Notification extends Component {

  onClick (event: Event) {
    const {onClick, id} = this.props
    event.preventDefault()
    onClick(id)
  }

  render () {
    const {category, content} = this.props
    return (
      <a
        className={styles[category]}
        onClick={event => this.onClick(event)}>
        <p className={styles.content}>
          {content}
        </p>
      </a>
    )
  }
}

Notification.propTypes = {
  category: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

export default Notification
