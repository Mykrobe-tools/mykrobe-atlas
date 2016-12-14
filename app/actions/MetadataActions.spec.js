import * as MetadataActions from './MetadataActions';

describe('MetadadaActions', () => {
  describe('postMetadataForm', () => {
    it('should have a type of "POST_METADATA_FORM"', () => {
      const expectedAction = {
        type: 'POST_METADATA_FORM'
      }
      expect(MetadataActions.postMetadataForm()).toEqual(expectedAction);
    });
  });
});
