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
import { tmpdir } from 'os';
import path from 'path';

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

describe('Processor Implementation', () => {
  ShouldCallCopyMethod();
  ShouldCallFsRenameMethod();
  ShouldCallUnZipMethod();
  ShouldCallLoggerInfoMethod();
  ShouldBeAFolder();
});

function ShouldBeAFolder() {
  it(`should be a folder with name idmlFiles in the unzipFolder`, async () => {
    mocks.loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      const folderPath = path.join(tmpdir(), process.env.ROOT_BUCKET ?? 'rootBucket', 'unzip-files', filename);
      expect(existsSync(folderPath)).toBeTruthy();
    }
  });
}

function ShouldCallLoggerInfoMethod() {
  it('should call logger.info 3 times and with 3 different message', async () => {
    mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
    mocks.fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    mocks.unZipMethodSpy.mockResolvedValue('Successfully Extracted');
    mocks.loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect.assertions(4);
      expect(mocks.loggerInfoSpy).toBeCalledTimes(3);
      expect(mocks.loggerInfoSpy).toHaveBeenNthCalledWith(1, 'Successfully copied file');
      expect(mocks.loggerInfoSpy).toHaveBeenNthCalledWith(2, 'Successfully rename file');
      expect(mocks.loggerInfoSpy).toHaveBeenNthCalledWith(3, 'Successfully Extracted');
    }
  });
}

function ShouldCallUnZipMethod() {
  it('should Call ZipExtractor Class with unZip method', async () => {
    mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
    mocks.fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    mocks.unZipMethodSpy.mockResolvedValue('Successfully Extracted');
    mocks.loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect(mocks.unZipMethodSpy).toBeCalledTimes(1);
      expect(await mocks.unZipMethodSpy.mock.results[0].value).toStrictEqual('Successfully Extracted');
      expect(mocks.loggerInfoSpy).toBeCalledWith('Successfully Extracted');
    }
  });
}

function ShouldCallFsRenameMethod() {
  it('should Call FileRename Class with fsRename method', async () => {
    mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
    mocks.fsRenameMethodSpy.mockResolvedValue('Successfully rename file');
    mocks.unZipMethodSpy.mockImplementation();
    mocks.loggerInfoSpy.mockImplementation();

    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect(mocks.fsRenameMethodSpy).toBeCalledTimes(1);
      expect(await mocks.fsRenameMethodSpy.mock.results[0].value).toStrictEqual('Successfully rename file');
    }
  });
}

function ShouldCallCopyMethod() {
  it('should Call FileCopier class with copy method', async () => {
    mocks.copyMethodSpy.mockResolvedValue('Successfully copied file');
    mocks.fsRenameMethodSpy.mockImplementation();
    mocks.unZipMethodSpy.mockImplementation();
    mocks.loggerInfoSpy.mockImplementation();
    try {
      await processor.process();
    } catch (error) {
      //
    } finally {
      expect(mocks.copyMethodSpy).toBeCalledTimes(1);
      expect(await mocks.copyMethodSpy.mock.results[0].value).toStrictEqual('Successfully copied file');
    }
  });
}
