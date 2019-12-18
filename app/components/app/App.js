/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import NotificationsContainer from '../notifications/NotificationsContainer';
import NotificationsStyle from '../notifications/NotificationsStyle';

import styles from './App.scss';
import MenuButton from '../menu/MenuButton';
import Menu from '../menu/Menu';
import MenuBg from '../menu/MenuBg';
import DragAndDrop from '../dragAndDrop/DragAndDrop';

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
    const { displayMenu } = this.state;
    return (
      <DragAndDrop className={styles.container}>
        <div className={styles.contentContainer}>{this.props.children}</div>
        <div className={styles.menuContainer}>
          <MenuBg displayMenu={displayMenu} toggleMenu={this.toggleMenu} />
          <Menu displayMenu={displayMenu} />
        </div>
        <MenuButton displayMenu={displayMenu} toggleMenu={this.toggleMenu} />
        <div className={styles.notificationsContainer}>
          <NotificationsContainer
            limit={5}
            order="desc"
            notificationsStyle={NotificationsStyle.SEPARATE}
            dismissed={false}
            hidden={false}
          />
        </div>
      </DragAndDrop>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
};

export default withRouter(App);
