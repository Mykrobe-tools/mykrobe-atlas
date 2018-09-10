/* @flow */

import _ from 'lodash';

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
      keys.push(keyPath.join('.'));
      if (typeof value === 'object') {
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
