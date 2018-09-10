/* @flow */

import _ from 'lodash';

import experimentSchema from './experiment';

export { default as experimentSchema } from './experiment';

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

// TODO: move into a generic json schema utility

export const keysForSchema = (
  schema: { properties?: any },
  currentKeyPath: Array<string> = []
): Array<string> => {
  let keys = [];
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]) => {
      const keyPath = currentKeyPath.concat(key);
      keys.push(keyPath.join('.'));
      keys = keys.concat(keysForSchema(value, keyPath));
    });
  } else if (schema['$ref']) {
    const definition = findSchemaDefinitionForRef(
      experimentSchema,
      schema['$ref']
    );
    keys = keys.concat(keysForSchema(definition, currentKeyPath));
  }
  return keys;
};

export const findSchemaDefinitionForRef = (schema: any, ref: string) => {
  const parts = ref.split('/').slice(1);
  const definition = _.get(schema, parts);
  return definition;
};
