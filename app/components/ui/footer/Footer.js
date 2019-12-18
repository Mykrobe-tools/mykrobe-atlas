/* @flow */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';

import styles from './Footer.scss';

class Footer extends React.Component<*> {
  render() {
    return (
      <Container fluid className={styles.container}>
        <div className={styles.contentWrap}>
          <div className={styles.item}>Copyright and hygiene links</div>
          <div className={styles.item}>
            <Link className={styles.link} to="/about">
              About
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} to="/contact">
              Contact
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} to="/legal">
              Terms and Conditions
            </Link>
          </div>
          <div className={styles.item}>
            <Link className={styles.link} to="/legal">
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    );
  }
}

export default Footer;
