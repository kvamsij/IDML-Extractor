import { ConfigProperties } from '@src/libs/Config/DefaultConfig';
import { FolderSystemConfig } from '@src/libs/Config/FolderSystemConfig';
import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { rm } from 'fs/promises';
import path from 'path';

let config: ConfigProperties;

beforeAll(() => {
  config = new FolderSystemConfig().getConfigProperties();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  const { location, rootBucket } = new FolderSystemConfig().getConfigProperties();
  await rm(path.join(location, rootBucket), { recursive: true });
});

describe('FolderSystem', () => {
  FileSystemInitializationTest();
  FileSystemGetFilePathsTest();
});

function FileSystemGetFilePathsTest() {
  describe('FolderSystem Implementation - get file paths', () => {
    it('should return filePaths', () => {
      const filename = 'fakeFile';
      const filePaths = new FolderSystem(filename).getFilePaths();
      const { location, rootBucket, idmlFileBucket, unzipFileBucket, zipFileBucket } = config;
      const expectedFilePaths = {
        fileCopierFilePaths: {
          sourcePath: path.join(location, rootBucket, idmlFileBucket, 'fakeFile.idml'),
          destinationPath: path.join(location, rootBucket, zipFileBucket, 'fakeFile.idml'),
        },
        fileRenameFilePaths: {
          sourcePath: path.join(location, rootBucket, zipFileBucket, 'fakeFile.idml'),
          destinationPath: path.join(location, rootBucket, zipFileBucket, 'fakeFile.zip'),
        },
        zipExtractorFilePaths: {
          sourcePath: path.join(location, rootBucket, zipFileBucket, `${filename}.zip`),
          destinationPath: path.join(location, rootBucket, unzipFileBucket, filename),
        },
      };
      expect(filePaths).toMatchObject(expectedFilePaths);
    });
  });
}

function FileSystemInitializationTest() {
  describe('FolderSystem Initialization', () => {
    it('should be able to call new() on FolderSystem Class with filename', () => {
      const folderSystem = new FolderSystem('fakeFileName');
      expect(folderSystem).toBeTruthy();
    });

    it('should call getFilePaths', () => {
      const folderSystem = new FolderSystem('fakeFileName');
      const mockGetFilePaths = jest.fn();
      jest.spyOn(folderSystem, 'getFilePaths').mockImplementation(mockGetFilePaths);
      folderSystem.getFilePaths();
      expect(mockGetFilePaths).toBeCalledTimes(1);
    });
  });
}
