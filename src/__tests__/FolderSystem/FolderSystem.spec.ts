import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { ConfigSetUpUtils } from '@src/__testUtils__/FolderSystem/ConfigSetUpUtils';
import { GetFilePathsUtils } from '@src/__testUtils__/FolderSystem/GetFilePathsUtils';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

dotenv.config();

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(async () => {
  const rootBucket = process.env.ROOT_BUCKET ?? 'rootBucket';
  await rm(path.join(tmpdir(), rootBucket), { recursive: true });
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

      const { rootBucket, idmlFileBucket, zipFileBucket, unZipFileBucket } = ConfigSetUpUtils();

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

function FileSystemGetFilePathsTest() {
  describe('FolderSystem Implementation - get file paths', () => {
    it('should return filePaths', () => {
      const filename = 'fakeFile';
      const filePaths = new FolderSystem(filename).getFilePaths();
      const { location, rootBucket, idmlFileBucket, zipFileBucket, unzipFileBucket } = GetFilePathsUtils();
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
