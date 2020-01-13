/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';

import { styles as pageHeaderStyles } from 'makeandship-js-common/src/components/ui/PageHeader';

import SearchInput from './SearchInput';

import styles from './SearchNavigation.scss';

type State = {
  q: ?string,
};

class SearchNavigation extends React.Component<*, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      q: props.q,
    };
  }

  componentDidUpdate = (prevProps: any) => {
    if (prevProps.q !== this.props.q) {
      this.setState({
        q: this.props.q,
      });
    }
  };

  onChange = (e: any) => {
    const q = e.target.value;
    this.setState({
      q,
    });
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    let { q } = this.state;
    // clear the parameter when empty string
    if (typeof q === 'string' && q.length === 0) {
      q = undefined;
    }
    onSubmit && onSubmit(q);
  };

  render() {
    const { title, placeholder } = this.props;
    const { q } = this.state;
    return (
      <Container className={styles.container} fluid>
        <Row className={styles.rowContainer}>
          <Col md={3}>
            <div className={pageHeaderStyles.title}>{title}</div>
          </Col>
          <Col md={6} className={styles.searchContainer}>
            <SearchInput
              value={q}
              placeholder={placeholder}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
            />
          </Col>
          <Col md={3} />
        </Row>
      </Container>
    );
  }
}

SearchNavigation.propTypes = {
  onChange: PropTypes.func,
  q: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
};

export default SearchNavigation;
