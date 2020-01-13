/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import SearchInput from './SearchInput';

import styles from './SearchNavigation.scss';

const SearchNavigation = ({
  q,
  onSubmit,
  title,
  placeholder,
  transparent,
}: React.ElementProps<*>): React.Element<*> => {
  const [stateQ, setStateQ] = React.useState(q);

  const handleOnChange = (e: any) => {
    const q = e.target.value;
    setStateQ(q);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    let result = stateQ;
    // clear the parameter when empty string
    if (typeof q === 'string' && q.length === 0) {
      result = undefined;
    }
    onSubmit && onSubmit(result);
  };

  return (
    <Container
      className={transparent ? styles.containerTransparent : styles.container}
      fluid
    >
      <Row className={styles.rowContainer}>
        <Col md={3}>
          <div className={styles.title}>{title}</div>
        </Col>
        <Col md={6} className={styles.searchContainer}>
          <SearchInput
            value={stateQ}
            placeholder={placeholder}
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
          />
        </Col>
        <Col md={3} />
      </Row>
      {transparent && <div className={styles.afterTransparent} />}
    </Container>
  );
};

SearchNavigation.defaultProps = {
  transparent: false,
};

SearchNavigation.propTypes = {
  onChange: PropTypes.func,
  q: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  transparent: PropTypes.bool,
};

export default SearchNavigation;
