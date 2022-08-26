import { existsSync, rmSync } from 'fs';
import { ErrorHandlerFilePaths, IErrorHandler } from './IErrorHandler';

export class ErrorHandler implements IErrorHandler {
  private filePaths: ErrorHandlerFilePaths;

  constructor(filePaths: ErrorHandlerFilePaths) {
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
