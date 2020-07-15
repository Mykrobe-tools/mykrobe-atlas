/* @flow */

import * as React from 'react';
import Loading from 'makeandship-js-common/src/components/ui/loading';

const Protected = ({
  login,
  isInitialised,
  isAuthenticated,
  children,
}: React.ElementProps<*>): React.Element<*> | null => {
  if (!isInitialised) {
    return <Loading />;
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
