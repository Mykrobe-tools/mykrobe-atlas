/* @flow */

import * as React from 'react';
import { Container } from 'reactstrap';

import styles from './Footer.module.scss';

class Footer extends React.Component<*> {
  render() {
    return (
      <Container fluid className={styles.container}>
        <div className={styles.contentWrap}>
          <div className={styles.item}>
            <a
              className={styles.link}
              rel="noopener noreferrer"
              target="_blank"
              href="https://www.ebi.ac.uk/data-protection/privacy-notice/mykrobe-atlas-database"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </Container>
    );
  }
}

export default Footer;
