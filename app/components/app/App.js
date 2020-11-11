/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/react';

import { uploadFileDrop } from '../../modules/upload';
import withAuth, {
  withAuthPropTypes,
} from 'makeandship-js-common/src/hoc/withAuth';

import NotificationsContainer from '../notifications/NotificationsContainer';
import NotificationsStyle from '../notifications/NotificationsStyle';

import styles from './App.module.scss';
import MenuButton from '../ui/navigation/menu/MenuButton';
import Menu from '../ui/navigation/menu/Menu';
import MenuBg from '../ui/navigation/menu/MenuBg';
import DragAndDrop from '../ui/dragAndDrop/DragAndDrop';

const USE_SENTRY =
  process.env.NODE_ENV !== 'development' &&
  window.env?.REACT_APP_SENTRY_PUBLIC_DSN;

if (USE_SENTRY) {
  Sentry.init({
    dsn: window.env.REACT_APP_SENTRY_PUBLIC_DSN,
  });
}

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
    const { isAuthenticated, uploadFileDrop } = this.props;
    const { displayMenu } = this.state;
    return (
      <Sentry.ErrorBoundary fallback={'An error has occured'} showDialog>
        <DragAndDrop enabled={isAuthenticated} onDrop={uploadFileDrop}>
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
      </Sentry.ErrorBoundary>
    );
  }
}

App.propTypes = {
  ...withAuthPropTypes,
  history: PropTypes.object,
  uploadFileDrop: PropTypes.func,
};

const withRedux = connect(null, {
  uploadFileDrop,
});

export default withRedux(withAuth(withRouter(App)));
