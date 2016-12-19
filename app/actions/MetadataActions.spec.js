import * as MetadataActions from './MetadataActions'

describe('MetadataActions', () => {
  describe('postMetadataForm', () => {
    it('should create a "POST_METADATA_FORM" action', () => {
      const expectedAction = {
        type: 'POST_METADATA_FORM'
      }
      expect(MetadataActions.postMetadataForm()).toEqual(expectedAction)
    })
  })

  describe('setMetadata', () => {
    it('should create a "SET_METADATA" action', () => {
      const metadata = {
        lorem: 'ipsum'
      }
      const expectedAction = {
        type: 'SET_METADATA',
        metadata
      }
      expect(MetadataActions.setMetadata(metadata)).toEqual(expectedAction)
    })
  })
})
