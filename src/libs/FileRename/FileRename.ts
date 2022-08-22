// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-default-export */

import path from 'path';
import { rename } from 'fs/promises';
import { IFileRename, Response } from './IFileRename';
import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';

enum MESSAGES {
  FILE_NOT_FOUND = 'File Not Found',
  NOT_IDML_FILE = 'Provided file is not an idml file',
  DONE = 'Successfully rename file',
}

enum EXTENSION {
  IDML = '.idml',
}

export default class FileRename implements IFileRename {
  private newFilePath: string;

  private hasExtensionIDML: boolean;

  constructor(private sourcePath: string) {
    const { dir, name } = path.parse(this.sourcePath);
    this.newFilePath = path.join(dir, 'test', `${name}.zip`);
    this.hasExtensionIDML = path.extname(this.sourcePath) === EXTENSION.IDML;
  }

  async fsRename(): Promise<Response> {
    if (!this.hasExtensionIDML) return [null, new IDMLExtractorError(MESSAGES.NOT_IDML_FILE)];
    try {
      await rename(this.sourcePath, this.newFilePath);
      return [MESSAGES.DONE, null];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return [null, new IDMLExtractorError(MESSAGES.FILE_NOT_FOUND)];
    }
  }
}
