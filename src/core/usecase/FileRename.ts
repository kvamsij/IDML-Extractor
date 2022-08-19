// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-default-export */

import path from 'path';
import { rename } from 'fs/promises';
import { IFileRename } from '../entities/IFileRename';

type FileRenameResults = Promise<{ message: string } | { error: string } | undefined>;

const FILE_EXTENSION = '.idml';
const SUCCESS_MSG = { message: 'Successfully rename file' };

const ERRORS = {
  FILE_NOT_FOUND: { error: 'File Not Found' },
  NOT_IDML_FILE: { error: 'Provided file is not an idml file' },
};

export default class FileRename implements IFileRename {
  private newFilePath: string;

  private hasExtensionIDML: boolean;

  constructor(private sourcePath: string) {
    const { dir, name } = path.parse(this.sourcePath);
    this.newFilePath = path.join(dir, 'test', `${name}.zip`);
    this.hasExtensionIDML = path.extname(this.sourcePath) === FILE_EXTENSION;
  }

  async fsRename(): FileRenameResults {
    if (!this.hasExtensionIDML) return ERRORS.NOT_IDML_FILE;
    try {
      await rename(this.sourcePath, this.newFilePath);
      return SUCCESS_MSG;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return ERRORS.FILE_NOT_FOUND;
    }
  }
}
