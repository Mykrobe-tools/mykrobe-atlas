const fetchPolyfill = require('whatwg-fetch');

global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Headers = fetchPolyfill.Headers;
global.Response = fetchPolyfill.Response;

import getReactAppEnv from './scripts/react-app-env';

// set up env vars that would be in browser window.env
window.env = getReactAppEnv();
