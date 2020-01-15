/* @flow */

import * as React from 'react';

export default ({ story }: React.ElementProps<*>): React.Element<*> => (
  <div
    style={{
      position: 'relative',
      display: 'flex',
      width: '100vh',
      height: '100vh',
    }}
  >
    {story}
  </div>
);
