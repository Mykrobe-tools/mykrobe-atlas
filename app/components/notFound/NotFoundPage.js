/* @flow */

import * as React from 'react';

import HeaderContainer from '../ui/header/HeaderContainer';
import Footer from '../ui/footer/Footer';
import Empty from '../ui/Empty';

import styles from './NotFoundPage.module.scss';

class NotFoundPage extends React.Component<*> {
  render() {
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Not Found'} />
        <Empty
          title={'Not Found'}
          subtitle={'The requested URL has no match'}
        />
        <Footer />
      </div>
    );
  }
}

export default NotFoundPage;
