/* @flow */

import * as React from 'react';
import Loading from 'makeandship-js-common/src/components/ui/loading';

const Protected = ({
  login,
  isInitialised,
  isAuthenticated,
  children,
}: React.ElementProps<*>): React.Element<*> | null => {
  React.useEffect(() => {
    if (isInitialised && !isAuthenticated) {
      login();
    }
  }, [isAuthenticated, isInitialised, login]);
  if (!isInitialised) {
    return <Loading />;
  }
  if (!isAuthenticated) {
    return null;
  }
  return children;
};

export default Protected;
