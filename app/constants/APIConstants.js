/* @flow */

export const BASE_URL = (
	process.env.NODE_ENV === 'production'
	? 'http://atlas-server:3000'
	: 'http://localhost:3000'
	);

// export const BASE_URL = 'http://13.69.243.89:8000';
