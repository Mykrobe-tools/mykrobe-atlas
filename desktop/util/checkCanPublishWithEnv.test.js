/* @flow */

import checkCanPublishWithEnv from './checkCanPublishWithEnv';

describe('checkCanPublishWithEnv', () => {
  describe('when env is missing all required vars', () => {
    it('should throw an error', () => {
      expect(() => {
        checkCanPublishWithEnv({});
      }).toThrow(
        `Missing required vars GH_TOKEN, MAC_NOTARIZE_APPLE_ID, MAC_NOTARIZE_APPLE_ID_PASSWORD, MAC_NOTARIZE_ASC_PROVIDER - see docs/dotenv.md`
      );
    });
  });
  describe('when env is missing some required vars', () => {
    it('should throw an error', () => {
      expect(() => {
        checkCanPublishWithEnv({
          GH_TOKEN: 'GH_TOKEN',
          MAC_NOTARIZE_ASC_PROVIDER: 'MAC_NOTARIZE_ASC_PROVIDER',
        });
      }).toThrow(
        `Missing required vars MAC_NOTARIZE_APPLE_ID, MAC_NOTARIZE_APPLE_ID_PASSWORD - see docs/dotenv.md`
      );
    });
  });
  describe('when env includes all required vars', () => {
    it('should not throw an error', () => {
      expect(() => {
        checkCanPublishWithEnv({
          GH_TOKEN: 'GH_TOKEN',
          MAC_NOTARIZE_APPLE_ID: 'MAC_NOTARIZE_APPLE_ID',
          MAC_NOTARIZE_APPLE_ID_PASSWORD: 'MAC_NOTARIZE_APPLE_ID_PASSWORD',
          MAC_NOTARIZE_ASC_PROVIDER: 'MAC_NOTARIZE_ASC_PROVIDER',
        });
      }).not.toThrow();
    });
  });
});
