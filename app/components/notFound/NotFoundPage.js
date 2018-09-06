/* @flow */

import * as React from 'react';

import Header from '../header/Header';
import Footer from '../footer/Footer';
import Empty from '../ui/Empty';

import styles from './NotFoundPage.scss';

class NotFoundPage extends React.Component<*> {
  render() {
    return (
      <div className={styles.container}>
        <Header title={'Not Found'} />
        <Empty
          title={'Not Found'}
          subtitle={'The requested URL has no match'}
        />;
        <Footer />
      </div>
    );
  }
}

export default NotFoundPage;
