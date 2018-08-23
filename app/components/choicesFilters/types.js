/* @flow */

export type Choice = {
  title: string,
  titles: Array<string>,
  min?: string | number,
  max?: string | number,
  choices?: Array<*>,
};
