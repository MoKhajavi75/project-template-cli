import { existsSync } from 'fs';
import mkdirp from 'mkdirp';

export const createDir = async (path: string): Promise<void> => {
  if (existsSync(path)) throw new Error(`${path} already exists`);

  await mkdirp(path);
};
