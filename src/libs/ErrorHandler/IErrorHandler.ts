export type ErrorHandlerFilePaths = {
  zipFilePath: string;
  idmlFilePath: string;
  extractedFolderPath: string;
};

export interface IErrorHandler {
  handle(): void;
}
