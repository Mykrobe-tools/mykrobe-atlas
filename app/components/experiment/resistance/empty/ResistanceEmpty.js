/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import Empty from '../../../ui/Empty';

class ResistanceEmpty extends React.Component<*> {
  render() {
    const { title, subtitle } = this.props;
    return <Empty title={title} subtitle={subtitle} />;
  }
  static defaultProps = {
    title: 'No Resistance Profile',
    subtitle: 'The analysis has no resistance profile',
  };
}

ResistanceEmpty.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default ResistanceEmpty;
