import { configure } from '@storybook/react';

// import all CSS files included globally rather than via a component
import '../app/styles/app.global.scss';

// automatically import all files ending in *.stories.js
const req = require.context('../app', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
