import { IDMLExtractorError } from '@src/libs/CustomError/IDMLExtractorError';
import { FileRename } from '@src/libs/FileRename/FileRename';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { CleanUp, CreateFolders, CreateTextFile, GetFilePaths } from '@src/__testUtils__/setUp';

import { existsSync } from 'fs';
import { tmpdir } from 'os';

const SUCCESS_MSG = 'Successfully renamed file';

const filename = 'fakeFile';
let filePaths: FolderSystemFilePaths;

beforeAll(async () => {
  await CreateFolders(filename);
  filePaths = GetFilePaths(filename);
});

afterAll(async () => {
  await CleanUp();
});

beforeEach(async () => {
  const { sourcePath } = filePaths.fileRenameFilePaths;
  await CreateTextFile(sourcePath);
  jest.clearAllMocks();
});

describe('FileRename', () => {
  FileRenameClassInitializerTest();
  FileRenameErrorsTest();
  FileRenameClassImplementationTest();
});

function FileRenameClassImplementationTest() {
  describe('FileRename Implementation', () => {
    it('should rename filename with .zip as extension', async () => {
      const { sourcePath, destinationPath } = filePaths.fileRenameFilePaths;
      const fileRename = new FileRename(sourcePath);
      await fileRename.fsRename();
      const isZipExists = existsSync(destinationPath);
      expect(isZipExists).toBeTruthy();
    });

    it('should called with given file path', async () => {
      const { sourcePath } = filePaths.fileRenameFilePaths;
      const fileRename = new FileRename(sourcePath);
      try {
        await fileRename.fsRename();
      } catch {
        // ignore errors
      } finally {
        expect(fileRename).toMatchObject({
          sourcePath,
        });
      }
    });
  });
}

function FileRenameErrorsTest() {
  describe('FileRename Errors', () => {
    it('should throw an error if the filePath does not exists', async () => {
      const fileRename = new FileRename('./example.idml');
      const response = fileRename.fsRename();
      await expect(response).rejects.toThrowError(new IDMLExtractorError('File Not Found'));
    });

    it('should throw an error if the given file extension is not .idml', async () => {
      const fakeTextFile = `${tmpdir()}/FakeFolder/fake.txt`;
      const fileRename = new FileRename(fakeTextFile);
      const response = fileRename.fsRename();
      await expect(response).rejects.toThrowError(new IDMLExtractorError('Provided file is not an idml file'));
    });
  });
}

function FileRenameClassInitializerTest() {
  const fileRename = new FileRename('./example');
  describe('FileRename class Initialization', () => {
    it('should be able to call new() on FileRename', () => {
      expect(fileRename).toBeTruthy();
    });
    it('rename method should have been called once', async () => {
      const renameMockMethod = jest
        .spyOn(fileRename, 'fsRename')
        .mockImplementation(async (): Promise<string> => SUCCESS_MSG);
      try {
        await fileRename.fsRename();
      } catch {
        // ignore errors
      } finally {
        expect(renameMockMethod).toHaveBeenCalledTimes(1);
      }
    });
  });
}
