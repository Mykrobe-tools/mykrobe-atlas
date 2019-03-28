export const DEBUG =
  process.env.DEBUG_PRODUCTION === '1' ||
  process.env.NODE_ENV === 'development';
