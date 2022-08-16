// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

/*
1. The `unZip` method takes two parameters: `sourcePath` and `destinationPath`.
2. The `sourcePath` parameter is the path to the zip file that needs to be extracted.
3. The `destinationPath` parameter is the path to the directory where the zip file needs to be extracted.
4. The `extract` method takes two parameters: `sourcePath` and `destinationPath`.
5. The `sourcePath` parameter is the path to the zip file that needs to be extracted.
6. The `destinationPath` parameter is the path to the directory where the zip file needs to be extracted.
7. The `extract` method extracts the zip file to the destination directory.
8. The `extract` method returns a promise.
9. The `extract` method throws an error if the provided file is not a zip file.
10. The `extract` method throws an error if the provided file is not found.
11. The `extract` method throws an error if the provided destination path is not absolute.
*/
/*
Extract a ZIP file to a destination directory.

Args:
  sourcePath: The path to the ZIP file.
  destinationPath: The path to the directory where the files will be extracted.
Returns:
  Nothing.
*/
import extract from 'extract-zip';
import { existsSync } from 'fs';
import path from 'path';

export class ZipExtractor {
  async unZip(sourcePath: string, destinationPath: string): Promise<void> {
    if (path.extname(sourcePath) !== '.zip') throw new Error('Provided file is not a ZIP file');
    if (!existsSync(sourcePath)) throw new Error('File not found');
    if (!path.isAbsolute(destinationPath)) throw new Error('DestinationPath must be absolute');
    extract(sourcePath, { dir: destinationPath });
  }
}
