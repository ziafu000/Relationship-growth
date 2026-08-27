// Central type exports
export * from './relationship';
export * from './activity';
export * from './plan';
export * from './feedback';
export * from './memory';
export * from './user';

// Database response types
export type DbResult<T> = {
  data: T | null;
  error: Error | null;
};

export type DbResultArray<T> = {
  data: T[] | null;
  error: Error | null;
};
