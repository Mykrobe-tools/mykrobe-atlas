/* @flow */

const checkCanPublishWithEnv = (env: any = {}) => {
  const required = [
    'GH_TOKEN',
    'MAC_NOTARIZE_APPLE_ID',
    'MAC_NOTARIZE_APPLE_ID_PASSWORD',
    'MAC_NOTARIZE_ASC_PROVIDER',
  ];
  const missing = required.filter((key) => {
    return !env[key];
  });
  if (missing.length) {
    throw `Missing required vars ${missing.join(', ')} - see docs/dotenv.md`;
  }
};

export default checkCanPublishWithEnv;
