/* @flow */
/* @flow */

import withAuth from 'makeandship-js-common/src/hoc/withAuth';

import withCurrentUser from '../../hoc/withCurrentUser';

import Header from './Header';

export default withCurrentUser(withAuth(Header));
