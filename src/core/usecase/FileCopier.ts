// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import { copyFile } from 'fs/promises';
import path from 'path';
import { IFileCopier } from '../entities/IFileCopier';

const ERRORS = {
  FILE_NOT_FOUND: { error: 'File Not Found' },
  NOT_ABSOLUTE_PATH: { error: 'Path must be absolute' },
  MUST_HAVE_IDML_EXT: { error: 'File must be an IDML file' },
};
const SUCCESS_MESSAGE = { message: 'Successfully copied file' };
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

  async copy(): Promise<{ error: string } | { message: string }> {
    const { sourcePath, destinationPath } = this.filePaths;
    if (!this.hasExtensionIDML) return ERRORS.MUST_HAVE_IDML_EXT;
    if (!path.isAbsolute(destinationPath)) return ERRORS.NOT_ABSOLUTE_PATH;

    try {
      await copyFile(sourcePath, destinationPath);
      return SUCCESS_MESSAGE;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return ERRORS.FILE_NOT_FOUND;
    }
  }
}
