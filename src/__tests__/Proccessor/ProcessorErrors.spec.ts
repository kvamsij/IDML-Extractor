import { IDMLExtractorError } from '@src/libs/CustomError/IDMLExtractorError';
import { GetFilePaths, GetProcessorClassInstance } from '@src/__testUtils__/Processor/GetProcessorClassInstance';
import { ProcessorTestCleanUp } from '@src/__testUtils__/Processor/ProcessorTestCleanUp';
import { ProcessorTestSetUp } from '@src/__testUtils__/Processor/ProcessorTestSetUp';
import { existsSync } from 'fs';

const filename = 'idmlFile';
let filePaths: any;
let processor: any;
let fileCopier: any;
let logger: any;
let fileRename: any;
let zipExtractor: any;
let errorHandler: any;

let copyMethodSpy: jest.SpyInstance;
let fsRenameMethodSpy: jest.SpyInstance;
let unZipMethodSpy: jest.SpyInstance;
let loggerInfoSpy: jest.SpyInstance;
let loggerErrorSpy: jest.SpyInstance;
let errorHandlerSpy: jest.SpyInstance;

beforeAll(async () => {
  filePaths = await GetFilePaths(filename);
  await ProcessorTestSetUp(filename);
});
afterAll(ProcessorTestCleanUp());
beforeEach(async () => {
  const classInstances = GetProcessorClassInstance(filePaths);
  processor = classInstances.processor;
  fileCopier = classInstances.fileCopier;
  logger = classInstances.logger;
  fileRename = classInstances.fileRename;
  zipExtractor = classInstances.zipExtractor;
  errorHandler = classInstances.errorHandler;

  copyMethodSpy = jest.spyOn(fileCopier, 'copy');
  fsRenameMethodSpy = jest.spyOn(fileRename, 'fsRename');
  unZipMethodSpy = jest.spyOn(zipExtractor, 'unZip');
  loggerInfoSpy = jest.spyOn(logger, 'info');
  loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
  errorHandlerSpy = jest.spyOn(errorHandler, 'handle');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Processor Errors', () => {
  describe('FileCopier throws an error', () => {
    it('should call errorHandler once', async () => {
      copyMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(errorHandlerSpy).toBeCalledTimes(1);
    });
    it('should log errors', async () => {
      copyMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(loggerErrorSpy).toBeCalled();
    });
    it('should not call next process FileRename.fsRename', async () => {
      copyMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(fsRenameMethodSpy).not.toBeCalled();
    });
    it(`should delete ${filename} from idmls-file folder`, async () => {
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(!existsSync(filePaths.fileCopierFilePaths.sourcePath)).toBeTruthy();
    });
  });
  describe('FileRename throws an error', () => {
    it('should call errorHandler once', async () => {
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(errorHandlerSpy).toBeCalledTimes(1);
    });
    it('should log info once', async () => {
      expect.assertions(2);
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(loggerInfoSpy).toBeCalledTimes(3);
      expect(loggerInfoSpy).toBeCalledWith('Successfully copied file');
    });
    it('should log errors', async () => {
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(loggerErrorSpy).toBeCalled();
    });
    it('should not call next process ZipExtractor.unZip', async () => {
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(unZipMethodSpy).not.toBeCalled();
    });
    it(`should delete ${filename} from idmls-file folder`, async () => {
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(!existsSync(filePaths.fileCopierFilePaths.sourcePath)).toBeTruthy();
    });
  });
  describe('ZipExtractor throws an error', () => {
    it('should call errorHandler once', async () => {
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
      unZipMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(errorHandlerSpy).toBeCalledTimes(1);
    });
    it('should call log info 3 times with messages', async () => {
      expect.assertions(5);
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
      unZipMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(loggerInfoSpy).toBeCalledTimes(4);
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(1, 'Successfully copied file');
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(2, 'Successfully rename file');
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(3, 'Starting clean up process....');
      expect(loggerInfoSpy).toHaveBeenLastCalledWith('Finish clean up process');
    });
    it('should log errors', async () => {
      copyMethodSpy.mockResolvedValue('Successfully copied file');
      fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
      unZipMethodSpy.mockRejectedValue(new IDMLExtractorError('File not Found'));
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(loggerErrorSpy).toBeCalled();
    });
    it(`should not create folder with '${filename}' in unzip-files`, async () => {
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(existsSync(filePaths.zipExtractorFilePaths.destinationPath)).toBeFalsy();
    });
    it(`should delete ${filename}.idml from idmls-file folder and ${filename}.zip from zip-files folder`, async () => {
      loggerInfoSpy.mockImplementation();
      loggerErrorSpy.mockImplementation();
      await processor.process();
      expect(existsSync(filePaths.fileCopierFilePaths.sourcePath)).toBeFalsy();
    });
  });
});
