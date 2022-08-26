import { GetFilePaths, GetProcessorClassInstance } from '@src/__testUtils__/Processor/GetProcessorClassInstance';
import { ProcessorTestCleanUp } from '@src/__testUtils__/Processor/ProcessorTestCleanUp';
import { ProcessorTestSetUp } from '@src/__testUtils__/Processor/ProcessorTestSetUp';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

const filename = 'idmlFile';
let filePaths: any;
let processor: any;
let fileCopier: any;
let logger: any;
let fileRename: any;
let zipExtractor: any;

let copyMethodSpy: jest.SpyInstance;
let fsRenameMethodSpy: jest.SpyInstance;
let unZipMethodSpy: jest.SpyInstance;
let loggerInfoSpy: jest.SpyInstance;

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

  copyMethodSpy = jest.spyOn(fileCopier, 'copy');
  fsRenameMethodSpy = jest.spyOn(fileRename, 'fsRename');
  unZipMethodSpy = jest.spyOn(zipExtractor, 'unZip');
  loggerInfoSpy = jest.spyOn(logger, 'info');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Processor Implementation', () => {
  it('should Call FileCopier class with copy method', async () => {
    copyMethodSpy.mockResolvedValue('Successfully copied file');
    fsRenameMethodSpy.mockImplementation();
    unZipMethodSpy.mockImplementation();
    loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect(copyMethodSpy).toBeCalledTimes(1);
      expect(await copyMethodSpy.mock.results[0].value).toStrictEqual('Successfully copied file');
    }
  });

  it('should Call FileRename Class with fsRename method', async () => {
    copyMethodSpy.mockResolvedValue('Successfully copied file');
    fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    unZipMethodSpy.mockImplementation();
    loggerInfoSpy.mockImplementation();

    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect(fsRenameMethodSpy).toBeCalledTimes(1);
      expect(await fsRenameMethodSpy.mock.results[0].value).toStrictEqual('Successfully rename file');
    }
  });

  it('should Call ZipExtractor Class with unZip method', async () => {
    copyMethodSpy.mockResolvedValue('Successfully copied file');
    fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    unZipMethodSpy.mockResolvedValue('Successfully Extracted');
    loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect(unZipMethodSpy).toBeCalledTimes(1);
      expect(await unZipMethodSpy.mock.results[0].value).toStrictEqual('Successfully Extracted');
      expect(loggerInfoSpy).toBeCalledWith('Successfully Extracted');
    }
  });
  it('should call logger.info 3 times and with 3 different message', async () => {
    copyMethodSpy.mockResolvedValue('Successfully copied file');
    fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    unZipMethodSpy.mockResolvedValue('Successfully Extracted');
    loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect.assertions(4);
      expect(loggerInfoSpy).toBeCalledTimes(3);
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(1, 'Successfully copied file');
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(2, 'Successfully rename file');
      expect(loggerInfoSpy).toHaveBeenNthCalledWith(3, 'Successfully Extracted');
    }
  });
  it(`should be a folder with name idmlFiles in the unzipFolder`, async () => {
    loggerInfoSpy.mockImplementation();
    // copyMethodSpy.mockResolvedValue('Successfully copied file');
    // fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    // unZipMethodSpy.mockResolvedValue('Successfully Extracted');
    try {
      await processor.process();
    } catch (error) {
      console.log(error);
      //
    } finally {
      const folderPath = path.join(tmpdir(), process.env.ROOT_BUCKET ?? 'rootBucket', 'unzip-files', filename);
      expect(existsSync(folderPath)).toBeTruthy();
    }
  });
});
