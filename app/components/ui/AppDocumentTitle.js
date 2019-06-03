/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { isString, isArray } from 'makeandship-js-common/src/util/is';

const productName = require('../../../package.json').productName;

const AppDocumentTitle = ({ title }) => {
  if (isString(title) && title.length > 0) {
    title = [title];
  } else if (!isArray(title)) {
    title = [];
  }
  title.push(productName);
  return <DocumentTitle title={title.join(' - ')} />;
};

AppDocumentTitle.propTypes = {
  title: PropTypes.any,
};

export default AppDocumentTitle;
