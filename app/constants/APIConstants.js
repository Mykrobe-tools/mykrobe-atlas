/* @flow */

export const BASE_URL = (
	process.env.NODE_ENV === 'production'
	? 'https://api.atlas-uat.makeandship.com'
	: 'http://localhost:3001'
	);

// export const BASE_URL = 'http://13.69.243.89:8000';
