/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';

import { clearAllNotifications } from '../../modules/notifications';

import HeaderContainer from '../header/HeaderContainer';
import Footer from '../footer/Footer';

import styles from './NotificationsPage.scss';
import NotificationsContainer from './NotificationsContainer';
import NotificationsStyle from './NotificationsStyle';

class NotificationsPage extends React.Component<*> {
  onClearClick = e => {
    const { clearAllNotifications } = this.props;
    e.preventDefault();
    clearAllNotifications();
  };
  render() {
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Notifications'} />
        <div className={styles.container}>
          <Container fluid>
            <PageHeader>
              <div>
                <div className={pageHeaderStyles.title}>Notifications</div>
              </div>
              <div>
                <PrimaryButton
                  onClick={this.onClearClick}
                  outline
                  size="sm"
                  icon="times-circle"
                  marginLeft
                >
                  Clear all
                </PrimaryButton>
              </div>
            </PageHeader>
            <NotificationsContainer
              notificationsStyle={NotificationsStyle.JOINED}
            />
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

NotificationsPage.propTypes = {
  clearAllNotifications: PropTypes.func.isRequired,
};

const withRedux = connect(
  null,
  {
    clearAllNotifications,
  }
);

export default withRedux(NotificationsPage);
