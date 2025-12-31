import * as bcrypt from 'bcrypt';

export const hash = (value: string) => bcrypt.hash(value, 10);
export const compare = (value: string, hashValue: string) =>
  bcrypt.compare(value, hashValue);
