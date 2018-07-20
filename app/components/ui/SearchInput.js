/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

class SearchInput extends React.Component<*> {
  render() {
    const { placeholder, name, value, onChange, onSubmit } = this.props;
    return (
      <Form onSubmit={onSubmit}>
        <InputGroup>
          <label className="sr-only" htmlFor={name}>
            {placeholder}
          </label>
          <Input
            type="text"
            name={name}
            tabIndex="0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            role="textbox"
            placeholder={placeholder}
            aria-label={placeholder}
            value={value || ''}
            onChange={onChange}
          />
          <InputGroupAddon addonType="append">
            <Button type="submit" color="mid">
              <i className="fa fa-search" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Form>
    );
  }
  static defaultProps = {
    placeholder: 'Search',
    name: 'q',
  };
}

SearchInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  value: PropTypes.string,
};

export default SearchInput;
