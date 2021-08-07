/* @flow */

import * as React from 'react';

export default ({ story }: React.ElementProps<*>): React.Element<*> => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      width: '100vw',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {story}
  </div>
);
