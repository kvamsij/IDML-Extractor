// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import extract from 'extract-zip';
import path from 'path';
import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';
import { IZipExtractor } from './IZipExtractor';

enum MESSAGES {
  MUST_HAVE_ZIP_EXT = 'Provided file is not a ZIP file',
  NOT_ABSOLUTE = 'DestinationPath must be absolute',
  FILE_NOT_FOUND = 'File not found',
  DONE = 'Successfully Extracted',
}
enum EXTENSION {
  ZIP = '.zip',
}

type FilePaths = {
  sourcePath: string;
  destinationPath: string;
};

export class ZipExtractor implements IZipExtractor {
  private hasExtensionZip: boolean;

  constructor(private filePaths: FilePaths) {
    const { sourcePath } = this.filePaths;
    this.hasExtensionZip = path.extname(sourcePath) === EXTENSION.ZIP;
  }

  async unZip(): Promise<string> {
    const { sourcePath, destinationPath } = this.filePaths;
    if (!this.hasExtensionZip) throw new IDMLExtractorError(MESSAGES.MUST_HAVE_ZIP_EXT);

    try {
      await extract(sourcePath, { dir: destinationPath });
      return MESSAGES.DONE;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === 'ENOENT') throw new IDMLExtractorError(MESSAGES.FILE_NOT_FOUND);
      if (err instanceof Error) throw new IDMLExtractorError(err.message);
      throw new IDMLExtractorError(err.message);
    }
  }
}
