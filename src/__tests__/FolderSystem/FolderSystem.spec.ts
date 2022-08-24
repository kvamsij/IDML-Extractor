import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { ConfigSetUpUtils } from '@src/__testUtils__/FolderSystem/ConfigSetUpUtils';
import { GetFilePathsUtils } from '@src/__testUtils__/FolderSystem/GetFilePathsUtils';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

dotenv.config();

afterEach(() => {
  jest.clearAllMocks();
});
describe('FolderSystem', () => {
  FileSystemInitializationTest();
  FileSystemConfigSetUpTest();
  FileSystemGetFilePathsTest();
});

function FileSystemGetFilePathsTest() {
  describe('FolderSystem Implementation - config set up', () => {
    it('should create folder structure', async () => {
      await new FolderSystem('fakeFile').configSetUp();

      const { rootBucket, idmlFileBucket, zipFileBucket, unZipFileBucket } = GetFilePathsUtils();

      const isRootFolderExists = existsSync(path.join(tmpdir(), rootBucket));
      const isIdmlFileFolderExists = existsSync(path.join(tmpdir(), rootBucket, idmlFileBucket));
      const isZipFileFolderExists = existsSync(path.join(tmpdir(), rootBucket, zipFileBucket));
      const isUnZipFileFolderExists = existsSync(path.join(tmpdir(), rootBucket, unZipFileBucket));

      expect(isRootFolderExists).toBeTruthy();
      expect(isIdmlFileFolderExists).toBeTruthy();
      expect(isZipFileFolderExists).toBeTruthy();
      expect(isUnZipFileFolderExists).toBeTruthy();
    });
  });
}

function FileSystemConfigSetUpTest() {
  describe('FolderSystem Implementation - get file paths', () => {
    it('should return filePaths', () => {
      const filePaths = new FolderSystem('fakeFile').getFilePaths();
      const { location, rootBucket, idmlFileBucket, zipFileBucket, unzipFileBucket } = ConfigSetUpUtils();

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
          sourcePath: path.join(location, rootBucket, zipFileBucket, 'fakeFile.zip'),
          destinationPath: path.join(location, rootBucket, unzipFileBucket),
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
