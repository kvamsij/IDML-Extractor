import { ErrorHandler } from '@src/core/usecase/ErrorHandler/ErrorHandler';
import { ErrorHandlerTestCleanUp } from '@src/__testUtils__/ErrorHandler/ErrorHandlerTestCleanUp';
import { ErrorHandlerTestSetUp } from '@src/__testUtils__/ErrorHandler/ErrorHandlerTestSetUp';
import { filePaths, testFolder } from '@src/__testUtils__/ErrorHandler/filePaths';
import { existsSync } from 'fs';

beforeAll(ErrorHandlerTestSetUp(testFolder, filePaths));
afterAll(ErrorHandlerTestCleanUp(testFolder));
afterEach(() => jest.clearAllMocks());

describe('ErrorHandler', () => {
  ErrorHandlerInstantiationTest();
  ErrorHandlerImplementationTest();
  ErrorHandlerErrorChecksTest();
});

function ErrorHandlerInstantiationTest() {
  describe('ErrorHandler: Instantiation', () => {
    const errorHandler = new ErrorHandler(filePaths);
    it('should be able to create new(filePaths) on class ErrorHandler', () => {
      expect(errorHandler).toBeTruthy();
    });
    it('should be called with filePaths', () => {
      expect(errorHandler).toMatchObject({ filePaths });
    });
  });
}

function ErrorHandlerImplementationTest() {
  describe('ErrorHandler: Implementation', () => {
    const errorHandler = new ErrorHandler(filePaths);
    const spyOnHandleMock = jest.spyOn(errorHandler, 'handle');

    it('should call handler() once', () => {
      errorHandler.handle();
      expect(spyOnHandleMock).toBeCalledTimes(1);
    });

    it('should delete zipFile if exists', () => {
      const isZipFileExists = existsSync(filePaths.zipFilePath);
      expect(isZipFileExists).toBeFalsy();
    });
    it('should delete idmlFile if exists', () => {
      const isIdmlFileExists = existsSync(filePaths.idmlFilePath);
      expect(isIdmlFileExists).toBeFalsy();
    });
    it('should delete extractedFolder if exists', () => {
      const isFolderExists = existsSync(filePaths.extractedFolderPath);
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
