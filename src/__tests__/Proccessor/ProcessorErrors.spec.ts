import { IDMLExtractorError } from '@src/libs/CustomError/IDMLExtractorError';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';

import {
  CleanUp,
  CreateFolders,
  CreateZipFile,
  GetClassInstanceAndMocks,
  GetClassInstanceAndMocksResults,
  GetFilePaths,
} from '@src/__testUtils__/setUp';
import { existsSync } from 'fs';

const filename = 'idmlFile';
let filePaths: FolderSystemFilePaths;
let processor: GetClassInstanceAndMocksResults['processor'];
let mocks: GetClassInstanceAndMocksResults['mocks'];

beforeAll(async () => {
  filePaths = GetFilePaths(filename);
  await CreateFolders(filename);
  await CreateZipFile(filePaths.fileCopierFilePaths.sourcePath);
});

afterAll(async () => {
  await CleanUp();
});

beforeEach(async () => {
  const mocksAndClassInstance = GetClassInstanceAndMocks(filePaths);
  processor = mocksAndClassInstance.processor;
  mocks = mocksAndClassInstance.mocks;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Processor Errors', () => {
  ErrorsThrowByFileCopier();
  ErrorsThrownByFileRename();
  ErrorsThrownByZipExtractor();
});

function ErrorsThrownByZipExtractor() {
  describe('ZipExtractor throws an error', () => {
    it('should call errorHandler once', async () => {
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
      mocks.unZipMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.errorHandlerSpy).toBeCalledTimes(1);
    });
    it('should call log info 3 times with messages', async () => {
      expect.assertions(5);
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
      mocks.unZipMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.loggerInfoSpy).toBeCalledTimes(4);
      expect(mocks.loggerInfoSpy).toHaveBeenNthCalledWith(1, 'Successfully copied file');
      expect(mocks.loggerInfoSpy).toHaveBeenNthCalledWith(2, 'Successfully rename file');
      expect(mocks.loggerInfoSpy).toHaveBeenNthCalledWith(3, 'Starting clean up process....');
      expect(mocks.loggerInfoSpy).toHaveBeenLastCalledWith('Finish clean up process');
    });
    it('should log errors', async () => {
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
      mocks.unZipMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.loggerErrorSpy).toBeCalled();
    });
    it(`should not create folder with '${filename}' in unzip-files`, async () => {
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(existsSync(filePaths.zipExtractorFilePaths.destinationPath)).toBeFalsy();
    });
    it(`should delete ${filename}.idml from idmls-file folder and ${filename}.zip from zip-files folder`, async () => {
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(existsSync(filePaths.fileCopierFilePaths.sourcePath)).toBeFalsy();
    });
  });
}

function ErrorsThrownByFileRename() {
  describe('FileRename throws an error', () => {
    it('should call errorHandler once', async () => {
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.errorHandlerSpy).toBeCalledTimes(1);
    });
    it('should log info once', async () => {
      expect.assertions(2);
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.loggerInfoSpy).toBeCalledTimes(3);
      expect(mocks.loggerInfoSpy).toBeCalledWith('Successfully copied file');
    });
    it('should log errors', async () => {
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.loggerErrorSpy).toBeCalled();
    });
    it('should not call next process ZipExtractor.unZip', async () => {
      mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
      mocks.fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.unZipMethodSpy).not.toBeCalled();
    });
    it(`should delete ${filename} from idmls-file folder`, async () => {
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(!existsSync(filePaths.fileCopierFilePaths.sourcePath)).toBeTruthy();
    });
  });
}

function ErrorsThrowByFileCopier() {
  describe('FileCopier throws an error', () => {
    it('should call errorHandler once', async () => {
      mocks.copyMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.errorHandlerSpy).toBeCalledTimes(1);
    });
    it('should log errors', async () => {
      mocks.copyMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.loggerErrorSpy).toBeCalled();
    });
    it('should not call next process FileRename.fsRename', async () => {
      mocks.copyMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(mocks.fsRenameMethodSpy).not.toBeCalled();
    });
    it(`should delete ${filename} from idmls-file folder`, async () => {
      mocks.loggerInfoSpy.mockImplementation();
      mocks.loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(!existsSync(filePaths.fileCopierFilePaths.sourcePath)).toBeTruthy();
    });
  });
}
