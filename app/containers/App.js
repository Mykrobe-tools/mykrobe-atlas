/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Container } from 'reactstrap';

import Notifications from 'makeandship-js-common/src/components/notifications/Notifications';

import styles from './App.css';
import Analysing from '../components/analysing/Analysing';
import MenuButton from '../components/menu/MenuButton';
import Menu from '../components/menu/Menu';
import MenuBg from '../components/menu/MenuBg';
import DragAndDrop from '../components/dragAndDrop/DragAndDrop';

import { getIsFetching as getAuthIsFetching } from 'makeandship-js-common/src/modules/auth';
import { getCurrentUserIsFetching } from '../modules/users';

type State = {
  displayMenu: boolean,
};

class App extends React.Component<*, State> {
  state = {
    displayMenu: false,
  };

  componentDidMount() {
    this.props.history.listen(() => {
      this.setState({
        displayMenu: false,
      });
    });
  }

  toggleMenu = () => {
    const { displayMenu } = this.state;
    this.setState({
      displayMenu: !displayMenu,
    });
  };

  render() {
    const { children } = this.props;
    const { displayMenu } = this.state;
    return (
      <DragAndDrop className={styles.container}>
        <Container fluid className={styles.contentWrap}>
          {children}
        </Container>
        <div className={styles.analysingContainer}>
          <Analysing />
        </div>
        <div className={styles.menuContainer}>
          <MenuBg displayMenu={displayMenu} toggleMenu={this.toggleMenu} />
          <Menu displayMenu={displayMenu} />
        </div>
        <MenuButton displayMenu={displayMenu} toggleMenu={this.toggleMenu} />
        <Notifications />
      </DragAndDrop>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: getCurrentUserIsFetching(state) || getAuthIsFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
