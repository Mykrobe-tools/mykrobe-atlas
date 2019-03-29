export const DEBUG =
  process.env.DEBUG_PRODUCTION === '1' ||
  process.env.NODE_ENV === 'development';

export const IS_WINDOWS = process.platform === 'win32';
export const IS_MAC = process.platform === 'darwin';
