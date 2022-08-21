import { existsSync, rmSync } from 'fs';

export type FilePaths = {
  zipFilePath: string;
  idmlFilePath: string;
  extractedFolderPath: string;
};

export class ErrorHandler {
  private filePaths: FilePaths;

  constructor(filePaths: FilePaths) {
    this.filePaths = filePaths;
  }

  // eslint-disable-next-line class-methods-use-this
  handle() {
    const { zipFilePath, idmlFilePath, extractedFolderPath } = this.filePaths;
    [zipFilePath, idmlFilePath, extractedFolderPath].forEach((filePath) => {
      if (existsSync(filePath)) rmSync(filePath, { recursive: true });
    });
  }
}
