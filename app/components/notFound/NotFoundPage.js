/* @flow */

import * as React from 'react';

import HeaderContainer from '../ui/header/HeaderContainer';
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
      </div>
    );
  }
}

export default NotFoundPage;
