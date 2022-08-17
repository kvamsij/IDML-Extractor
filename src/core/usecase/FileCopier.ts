// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import { existsSync } from 'fs';
import { copyFile } from 'fs/promises';
import path from 'path';
import { IFileCopier } from '../entities/IFileCopier';

export class FileCopier implements IFileCopier {
  async copy(sourcePath: string, destinationPath: string): Promise<void> {
    if (!existsSync(sourcePath)) throw new Error('File not found');
    if (!path.isAbsolute(destinationPath)) throw new Error('Path must be absolute');
    copyFile(sourcePath, destinationPath);
  }
}
