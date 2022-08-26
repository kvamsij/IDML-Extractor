import { IDMLExtractorError } from '@src/libs/CustomError/IDMLExtractorError';
import { FileCopier } from '@src/libs/FileCopier/FileCopier';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { CleanUp, CreateFolders, CreateTextFile, GetFilePaths } from '@src/__testUtils__/setUp';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

enum MESSAGES {
  FILE_NOT_FOUND = 'File Not Found',
  NOT_ABSOLUTE_PATH = 'Path must be absolute',
  MUST_HAVE_IDML_EXT = 'File must be an IDML file',
  DONE = 'Successfully copied file',
}

const filename = 'fake';
let filePaths: FolderSystemFilePaths;

beforeAll(async () => {
  await CreateFolders(filename);
  filePaths = GetFilePaths(filename);
});
beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await CleanUp();
});

describe('FileCopier', () => {
  beforeAll(async () => {
    const { fileCopierFilePaths } = filePaths;
    await CreateTextFile(fileCopierFilePaths.sourcePath);
  });

  fileCopierInitializerTests();
  fileCopierErrorsTests();
  fileCopierImplementationTests();
});

function fileCopierImplementationTests() {
  describe('FileCopier implementation', () => {
    it('should execute copy method and return success message', async () => {
      const { fileCopierFilePaths } = filePaths;
      const fileCopier = new FileCopier(fileCopierFilePaths);
      const response = fileCopier.copy();
      await expect(response).resolves.toBe(MESSAGES.DONE);
    });

    it('should copy fake.idml file to FakeFolder', async () => {
      const { destinationPath } = filePaths.fileCopierFilePaths;
      const isFileExists = existsSync(destinationPath);
      expect(isFileExists).toBeTruthy();
    });
  });
}

function fileCopierErrorsTests() {
  describe('FileCopier Errors', () => {
    it('should throw an error if source file is not an idml file(.idml extension)', async () => {
      const { sourcePath, destinationPath } = filePaths.fileCopierFilePaths;
      const fakeSourcePath = `${path.dirname(sourcePath)}/noFile.txt`;
      const fileCopier = new FileCopier({ sourcePath: fakeSourcePath, destinationPath });
      const response = fileCopier.copy();
      await expect(response).rejects.toThrowError(new IDMLExtractorError(MESSAGES.MUST_HAVE_IDML_EXT));
    });

    it('should throw an error if destination file path not absolute', async () => {
      const { sourcePath } = filePaths.fileCopierFilePaths;
      const destinationPath = 'destinationPath';
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const response = fileCopier.copy();
      await expect(response).rejects.toThrowError(new IDMLExtractorError(MESSAGES.NOT_ABSOLUTE_PATH));
    });

    it('should throw an error if source file path not found', async () => {
      const sourcePath = path.join(`${tmpdir()}/noPath/fake.idml`);
      const destinationPath = path.join(`${tmpdir()}/noPath/fake.idml`);
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const response = fileCopier.copy();
      await expect(response).rejects.toThrowError(new IDMLExtractorError(MESSAGES.FILE_NOT_FOUND));
    });
  });
}

function fileCopierInitializerTests() {
  describe('FileCopier Initialization', () => {
    const sourcePath = 'sourcePath';
    const destinationPath = 'destination';
    it('should be able to call new() on FileCopier', () => {
      const fileCopier = new FileCopier({ sourcePath, destinationPath });

      expect(fileCopier).toBeTruthy();
    });
    it('copy method should have be called once', async () => {
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const copyMockMethod = jest.spyOn(fileCopier, 'copy');

      try {
        await fileCopier.copy();
      } catch {
        // ignore errors
      } finally {
        expect(copyMockMethod).toHaveBeenCalledTimes(1);
      }
    });
  });
}
