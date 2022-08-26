// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-default-export */

import path from 'path';
import { rename } from 'fs/promises';
import { IFileRename } from './IFileRename';
import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';

enum MESSAGES {
  FILE_NOT_FOUND = 'File Not Found',
  NOT_IDML_FILE = 'Provided file is not an idml file',
  DONE = 'Successfully rename file',
}

enum EXTENSION {
  IDML = '.idml',
}

export class FileRename implements IFileRename {
  private newFilePath: string;

  private hasExtensionIDML: boolean;

  constructor(private sourcePath: string) {
    const { dir, name } = path.parse(this.sourcePath);
    this.newFilePath = path.join(dir, `${name}.zip`);
    this.hasExtensionIDML = path.extname(this.sourcePath) === EXTENSION.IDML;
  }

  async fsRename(): Promise<string> {
    if (!this.hasExtensionIDML) throw new IDMLExtractorError(MESSAGES.NOT_IDML_FILE);
    try {
      await rename(this.sourcePath, this.newFilePath);
      return MESSAGES.DONE;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new IDMLExtractorError(MESSAGES.FILE_NOT_FOUND);
    }
  }
}
