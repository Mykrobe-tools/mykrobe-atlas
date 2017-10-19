/* @flow */

export const BASE_URL: string =
  process.env.NODE_ENV === 'production'
    ? (process.env.API_URL: any)
    : 'https://api.atlas-dev.makeandship.com';

// export const BASE_URL = 'https://localhost:3001';
// export const BASE_URL = 'http://13.69.243.89:8000';

export const USER_COOKIE_NAME = 'api.atlas.makeandship.com';
