/* @flow */

if (!process.env.API_URL) {
  throw new Error(`Fatal - process.env.API_URL is undefined`);
}

if (!process.env.AUTH_COOKIE_NAME) {
  throw new Error(`Fatal - process.env.AUTH_COOKIE_NAME is undefined`);
}

export const API_URL = process.env.API_URL;
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME;
