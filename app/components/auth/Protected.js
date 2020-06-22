/* @flow */

import * as React from 'react';

const Protected = ({
  login,
  isInitialised,
  isAuthenticated,
  children,
}: React.ElementProps<*>): React.Element<*> | null => {
  if (!isInitialised) {
    return null;
  }
  if (!isAuthenticated) {
    React.useEffect(() => {
      login();
    }, []);
    return null;
  }
  return children;
};

export default Protected;
