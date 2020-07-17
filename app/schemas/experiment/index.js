/* @flow */

import _memoize from 'lodash.memoize';

import experimentSchema from 'mykrobe-atlas-jsonschema/schemas/experiment';

export { experimentSchema };
export { keysForSchema, completenessForSchemaAndData } from './util';

// filter the schema to only include the passed subsections
// this is used to split the schema into several individual steps in the UI

export const filteredSchemaWithSubsections = _memoize(
  (subsections: Array<string>): any => {
    if (!subsections) {
      return experimentSchema;
    }
    const properties = {};
    Object.entries(experimentSchema.definitions.Metadata.properties).forEach(
      ([key, value]) => {
        if (subsections.includes(key)) {
          properties[key] = value;
        }
      }
    );

    const filteredSchema = {
      ...experimentSchema,
      definitions: {
        ...experimentSchema.definitions,
        Metadata: {
          // filtering what's shown in metadata
          ...experimentSchema.definitions.Metadata,
          title: '',
          properties,
        },
      },
      properties: {
        // only include metadata
        metadata: experimentSchema.properties.metadata,
      },
    };
    return filteredSchema;
  },
  (subsections: Array<string>) => (subsections ? subsections.join('-') : '-')
);

const metadataKeys = Object.keys(
  experimentSchema.definitions.Metadata.properties
);
const experimentMetadataSchema = filteredSchemaWithSubsections(metadataKeys);

export { experimentMetadataSchema };
