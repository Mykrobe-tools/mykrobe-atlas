/* @flow */

import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';

import styles from './TabNavigation.scss';

export const TabNavigationLink = (
  props: React.ElementProps<*>
): React.Element<*> => (
  <NavLink
    className={styles.navigationItem}
    activeClassName={styles.navigationItemActive}
    {...props}
  />
);

const TabNavigation = (props: React.ElementProps<*>): React.Element<*> => (
  <Container fluid className={styles.container}>
    <div className={styles.navigation}>{props.children}</div>
  </Container>
);

export default TabNavigation;
