/* @flow */

import { createUrlNetworkStatusModule } from 'makeandship-js-common/src/modules/networkStatus/urlNetworkStatusModule';

const urlNetworkStatusModule = createUrlNetworkStatusModule({
  typePrefix: 'networkStatus/urlNetworkStatus/',
  getState: (state: any) => state?.networkStatus?.urlNetworkStatus,
  url:
    window.env?.REACT_APP_API_HEALTH_CHECK_URL ||
    `${window.env.REACT_APP_API_URL}/health-check`,
  pollInterval: window.env?.REACT_APP_API_HEALTH_CHECK_INTERVAL || 10000,
  timeout: window.env?.REACT_APP_API_HEALTH_CHECK_TIMEOUT || 30000,
});

const {
  reducer,
  actions,
  selectors,
  sagas: { urlNetworkStatusSaga: saga },
} = urlNetworkStatusModule;

export { reducer, actions, selectors, saga };
