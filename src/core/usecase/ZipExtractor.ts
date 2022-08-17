// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import extract from 'extract-zip';
import { existsSync } from 'fs';
import path from 'path';

export class ZipExtractor {
  async unZip(sourcePath: string, destinationPath: string): Promise<void> {
    if (path.extname(sourcePath) !== '.zip') throw new Error('Provided file is not a ZIP file');
    if (!existsSync(sourcePath)) throw new Error('File not found');
    if (!path.isAbsolute(destinationPath)) throw new Error('DestinationPath must be absolute');
    await extract(sourcePath, { dir: destinationPath });
  }
}
