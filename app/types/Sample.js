/* @flow */

export type Sample = {
  _id: string,
  collected_at: string,
  location: {
    name: string,
    lat: string,
    long: string
  }
};
