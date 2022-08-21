import { existsSync, rmSync } from 'fs';
import { IErrorHandler } from '../entities/IErrorHandler';

export type FilePaths = {
  zipFilePath: string;
  idmlFilePath: string;
  extractedFolderPath: string;
};

export class ErrorHandler implements IErrorHandler {
  private filePaths: FilePaths;

  constructor(filePaths: FilePaths) {
    this.filePaths = filePaths;
  }

  // eslint-disable-next-line class-methods-use-this
  handle(): void {
    const { zipFilePath, idmlFilePath, extractedFolderPath } = this.filePaths;
    [zipFilePath, idmlFilePath, extractedFolderPath].forEach((filePath) => {
      if (existsSync(filePath)) rmSync(filePath, { recursive: true });
    });
  }
}
