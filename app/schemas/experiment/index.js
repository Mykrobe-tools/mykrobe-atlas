/* @flow */

import _ from 'lodash';

import experimentSchema from './experiment';

export { default as experimentSchema } from './experiment';
export { keysForSchema, completenessForSchemaAndData } from './util';

// filter the schema to only include the passed subsections
// this is used to split the schema into several individual steps in the UI

export const filteredSchemaWithSubsections = _.memoize(
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
  (subsections: Array<string>) => subsections.join('-')
);
