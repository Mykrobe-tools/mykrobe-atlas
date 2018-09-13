/* @flow */

import _ from 'lodash';

// TODO: move into common library

export const keysForSchema = (
  schema: any,
  subSchema?: any,
  currentKeyPath: Array<string> = []
): Array<string> => {
  let keys = [];
  if (!subSchema) {
    subSchema = schema;
  }
  if (subSchema.properties) {
    Object.entries(subSchema.properties).forEach(([key, value]) => {
      const keyPath = currentKeyPath.concat(key);
      if (typeof value === 'object' && value !== null) {
        // don't add this key path unless it can represent a value
        if (value.type && value.type !== 'object') {
          keys.push(keyPath.join('.'));
        }
        keys = keys.concat(keysForSchema(schema, value, keyPath));
      }
    });
  } else if (subSchema.$ref) {
    const definition = findSchemaDefinitionForRef(schema, subSchema['$ref']);
    keys = keys.concat(keysForSchema(schema, definition, currentKeyPath));
  }
  return keys;
};

export const findSchemaDefinitionForRef = (schema: any, ref: string) => {
  const parts = ref.split('/').slice(1);
  const definition = _.get(schema, parts);
  return definition;
};

// TODO: this is currently very naive, e.g. will not skip key paths due to visibility rules

export const completenessForSchemaAndData = (schema: any, data: any) => {
  let complete = 0;
  const keys = keysForSchema(schema);
  const total = keys.length;
  keys.forEach(key => {
    const value = _.get(data, key);
    if (value) {
      complete++;
    }
  });
  return { complete, total };
};
