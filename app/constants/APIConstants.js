/* @flow */

export const BASE_URL = (
	process.env.NODE_ENV === 'production'
	? 'https://api.atlas-uat.makeandship.com'
	: 'https://api.atlas-dev.makeandship.com'
	);

// export const BASE_URL = 'https://localhost:3001';
// export const BASE_URL = 'http://13.69.243.89:8000';

export const USER_COOKIE_NAME = 'api.atlas-dev.makeandship.com';
