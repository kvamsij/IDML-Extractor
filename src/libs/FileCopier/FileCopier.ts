// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import { copyFile } from 'fs/promises';
import path from 'path';
import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';
import { IFileCopier, Response } from './IFileCopier';

enum MESSAGES {
  FILE_NOT_FOUND = 'File Not Found',
  NOT_ABSOLUTE_PATH = 'Path must be absolute',
  MUST_HAVE_IDML_EXT = 'File must be an IDML file',
  DONE = 'Successfully copied file',
}

const EXT = '.idml';

type FilePaths = {
  sourcePath: string;
  destinationPath: string;
};

export class FileCopier implements IFileCopier {
  private hasExtensionIDML: boolean;

  constructor(private filePaths: FilePaths) {
    const { sourcePath } = this.filePaths;
    this.hasExtensionIDML = path.extname(sourcePath) === EXT;
  }

  async copy(): Promise<Response> {
    const { sourcePath, destinationPath } = this.filePaths;
    if (!this.hasExtensionIDML) return [null, new IDMLExtractorError(MESSAGES.MUST_HAVE_IDML_EXT)];
    if (!path.isAbsolute(destinationPath)) return [null, new IDMLExtractorError(MESSAGES.NOT_ABSOLUTE_PATH)];

    try {
      await copyFile(sourcePath, destinationPath);
      return [MESSAGES.DONE, null];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return [null, new IDMLExtractorError(MESSAGES.FILE_NOT_FOUND)];
    }
  }
}
