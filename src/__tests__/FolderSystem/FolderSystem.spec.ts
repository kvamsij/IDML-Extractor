import { FolderSystemConfig, FolderSystemConfigProperties } from '@src/libs/Config/FolderSystemConfig';
import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

let config: FolderSystemConfigProperties;

beforeAll(() => {
  config = new FolderSystemConfig().getConfig();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  const { location, rootBucket } = new FolderSystemConfig().getConfig();
  await rm(path.join(location, rootBucket), { recursive: true });
});

describe('FolderSystem', () => {
  FileSystemInitializationTest();
  FileSystemConfigSetUpTest();
  FileSystemGetFilePathsTest();
});

function FileSystemConfigSetUpTest() {
  describe('FolderSystem Implementation - config set up', () => {
    it('should create folder structure', async () => {
      await new FolderSystem('fakeFile').configSetUp();
      const { location, rootBucket, idmlFileBucket, unzipFileBucket, zipFileBucket } = config;
      const isRootFolderExists = existsSync(path.join(location, rootBucket));
      const isIdmlFileFolderExists = existsSync(path.join(location, rootBucket, idmlFileBucket));
      const isZipFileFolderExists = existsSync(path.join(location, rootBucket, zipFileBucket));
      const isUnZipFileFolderExists = existsSync(path.join(location, rootBucket, unzipFileBucket));

      expect(isRootFolderExists).toBeTruthy();
      expect(isIdmlFileFolderExists).toBeTruthy();
      expect(isZipFileFolderExists).toBeTruthy();
      expect(isUnZipFileFolderExists).toBeTruthy();
    });
  });
}

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

    it('should call configSetUp', () => {
      const folderSystem = new FolderSystem('fakeFileName');
      const mockSetUp = jest.fn();
      jest.spyOn(folderSystem, 'configSetUp').mockImplementation(mockSetUp);
      folderSystem.configSetUp();
      expect(mockSetUp).toBeCalledTimes(1);
    });
  });
}
