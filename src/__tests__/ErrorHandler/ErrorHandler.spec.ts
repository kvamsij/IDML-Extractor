import { ErrorHandler } from '@src/libs/ErrorHandler/ErrorHandler';
import { ErrorHandlerFilePaths } from '@src/libs/ErrorHandler/IErrorHandler';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { CleanUp, CreateFolders, GetFilePaths } from '@src/__testUtils__/setUp';
import { existsSync } from 'fs';

const filename = 'fake';
let filePaths: FolderSystemFilePaths;
let errorHandlerFilePaths: ErrorHandlerFilePaths;

beforeAll(async () => {
  await CreateFolders(filename);
  filePaths = GetFilePaths(filename);
});

afterEach(() => jest.clearAllMocks());
afterAll(async () => {
  await CleanUp();
});

describe('ErrorHandler', () => {
  beforeEach(() => {
    errorHandlerFilePaths = {
      zipFilePath: filePaths.fileRenameFilePaths.sourcePath,
      idmlFilePath: filePaths.fileCopierFilePaths.sourcePath,
      extractedFolderPath: filePaths.zipExtractorFilePaths.destinationPath,
    };
  });
  ErrorHandlerInstantiationTest();
  ErrorHandlerImplementationTest();
  ErrorHandlerErrorChecksTest();
});

function ErrorHandlerInstantiationTest() {
  describe('ErrorHandler: Instantiation', () => {
    it('should be able to create new(filePaths) on class ErrorHandler', () => {
      const errorHandler = new ErrorHandler(errorHandlerFilePaths);
      expect(errorHandler).toBeTruthy();
    });
    it('should be called with filePaths', () => {
      const errorHandler = new ErrorHandler(errorHandlerFilePaths);
      expect(errorHandler).toMatchObject({ filePaths: errorHandlerFilePaths });
    });
  });
}

function ErrorHandlerImplementationTest() {
  describe('ErrorHandler: Implementation', () => {
    it('should call handler() once', () => {
      const errorHandler = new ErrorHandler(errorHandlerFilePaths);
      const spyOnHandleMock = jest.spyOn(errorHandler, 'handle');
      errorHandler.handle();
      expect(spyOnHandleMock).toBeCalledTimes(1);
    });

    it('should delete zipFile if exists', () => {
      const errorHandler = new ErrorHandler(errorHandlerFilePaths);
      errorHandler.handle();
      const isZipFileExists = existsSync(errorHandlerFilePaths.zipFilePath);
      expect(isZipFileExists).toBeFalsy();
    });
    it('should delete idmlFile if exists', () => {
      const errorHandler = new ErrorHandler(errorHandlerFilePaths);
      errorHandler.handle();
      const isIdmlFileExists = existsSync(errorHandlerFilePaths.idmlFilePath);
      expect(isIdmlFileExists).toBeFalsy();
    });
    it('should delete extractedFolder if exists', () => {
      const isFolderExists = existsSync(errorHandlerFilePaths.extractedFolderPath);
      expect(isFolderExists).toBeFalsy();
    });
  });
}

function ErrorHandlerErrorChecksTest() {
  describe('ErrorHandler: Error Checks', () => {
    const errorHandler = new ErrorHandler({ zipFilePath: '', extractedFolderPath: '', idmlFilePath: '' });
    errorHandler.handle();
    it('should not throw any errors', () => {
      expect(errorHandler.handle()).toBe(undefined);
    });
  });
}
