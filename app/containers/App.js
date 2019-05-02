/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import NotificationsContainer from '../components/notifications/NotificationsContainer';
import NotificationsStyle from '../components/notifications/NotificationsStyle';

import styles from './App.scss';
import MenuButton from '../components/menu/MenuButton';
import Menu from '../components/menu/Menu';
import MenuBg from '../components/menu/MenuBg';
import DragAndDrop from '../components/dragAndDrop/DragAndDrop';

const defaultTitle = require('../../package.json').productName;

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
        <DocumentTitle title={defaultTitle} />
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
  history: PropTypes.object.isRequired,
};

export default withRouter(App);
