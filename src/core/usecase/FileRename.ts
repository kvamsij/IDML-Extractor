import { existsSync } from 'fs';
import { rename } from 'fs/promises';
import path from 'path';

export class FileRename {
  // eslint-disable-next-line class-methods-use-this
  async rename(filePath: string): Promise<void> {
    if (path.extname(filePath) !== '.idml') throw new Error('Provided file is not an idml file');
    if (!existsSync(filePath)) throw new Error('File not found');
    const { dir, name } = path.parse(filePath);
    const newFilePath = path.join(dir, 'test', `${name}.zip`);
    await rename(filePath, newFilePath);
  }
}
