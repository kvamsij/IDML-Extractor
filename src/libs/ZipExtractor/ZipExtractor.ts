// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import extract from 'extract-zip';
import path from 'path';
import { IZipExtractor } from './IZipExtractor';

const ERRORS = {
  MUST_HAVE_ZIP_EXT: { error: 'Provided file is not a ZIP file' },
  NOT_ABSOLUTE: { error: 'DestinationPath must be absolute' },
  FILE_NOT_FOUND: { error: 'File not found' },
};
const SUCCESS_MSG = { message: 'Successfully Extracted' };
const EXT = '.zip';

type FilePaths = {
  sourcePath: string;
  destinationPath: string;
};

export class ZipExtractor implements IZipExtractor {
  private hasExtensionZip: boolean;

  constructor(private filePaths: FilePaths) {
    const { sourcePath } = this.filePaths;
    this.hasExtensionZip = path.extname(sourcePath) === EXT;
  }

  async unZip(): Promise<{ message: string } | { error: string } | undefined> {
    const { sourcePath, destinationPath } = this.filePaths;
    if (!this.hasExtensionZip) return ERRORS.MUST_HAVE_ZIP_EXT;

    try {
      await extract(sourcePath, { dir: destinationPath });
      return SUCCESS_MSG;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === 'ENOENT') return ERRORS.FILE_NOT_FOUND;
      if (err instanceof Error) return { error: err.message };
      return { error: err.message };
    }
  }
}
