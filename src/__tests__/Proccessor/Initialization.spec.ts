import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';

import {
  CleanUp,
  CreateFolders,
  CreateZipFile,
  GetClassInstanceAndMocks,
  GetClassInstanceAndMocksResults,
  GetFilePaths,
} from '@src/__testUtils__/setUp';

const filename = 'fakeFile';
let filePaths: FolderSystemFilePaths;
let processor: GetClassInstanceAndMocksResults['processor'];

beforeAll(async () => {
  filePaths = GetFilePaths(filename);
  await CreateFolders(filename);
  await CreateZipFile(filePaths.fileCopierFilePaths.sourcePath);
  const mocksAndClassInstance = GetClassInstanceAndMocks(filePaths);
  processor = mocksAndClassInstance.processor;
});

afterAll(async () => {
  await CleanUp();
});

describe('IDML Processor', () => {
  describe('Processor Initialization', () => {
    it('should be able to call new() on Processor class', async () => {
      expect(processor).toBeTruthy();
    });
    it('should have been called with parameters', () => {
      expect.assertions(5);
      expect(processor).toHaveProperty(['fileCopier', 'filePaths'], filePaths.fileCopierFilePaths);
      expect(processor).toHaveProperty(['fileRename', 'sourcePath'], filePaths.fileRenameFilePaths.sourcePath);
      expect(processor).toHaveProperty(['zipExtractor', 'filePaths'], filePaths.zipExtractorFilePaths);
      expect(processor).toHaveProperty('logger');
      expect(processor).toHaveProperty(['errorHandler', 'filePaths'], {
        extractedFolderPath: filePaths.zipExtractorFilePaths.destinationPath,
        idmlFilePath: filePaths.fileCopierFilePaths.sourcePath,
        zipFilePath: filePaths.fileRenameFilePaths.sourcePath,
      });
    });
    it('should call process method once', () => {
      const mockProcessMethod = jest.fn();
      jest.spyOn(processor, 'process').mockImplementation(mockProcessMethod);
      processor.process();
      expect(mockProcessMethod).toBeCalledTimes(1);
    });
  });
});
