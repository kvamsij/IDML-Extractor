import { FileCopier } from '@src/core/usecase/FileCopier';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { testSetUp, testCleanUp } from '../../__testUtils__/FileCopier/testCleanUp';

const ERRORS = {
  FILE_NOT_FOUND: { error: 'File Not Found' },
  NOT_ABSOLUTE_PATH: { error: 'Path must be absolute' },
  MUST_HAVE_IDML_EXT: { error: 'File must be an IDML file' },
};
const SUCCESS_MESSAGE = { message: 'Successfully copied file' };

beforeAll(testSetUp());

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(testCleanUp());

describe('FileCopier', () => {
  fileCopierInitializerTests();
  fileCopierErrorsTests();
  fileCopierImplementationTests();
});

function fileCopierImplementationTests() {
  describe('FileCopier implementation', () => {
    const sourcePath = path.join(`${tmpdir()}/fake.idml`);
    const destinationPath = path.join(`${tmpdir()}/FakeFolder/fakeIDML.idml`);

    it('should execute copy method and return undefined', async () => {
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const result = await fileCopier.copy();
      expect(result).toMatchObject(SUCCESS_MESSAGE);
    });

    it('should copy fake.idml file to FakeFolder', async () => {
      const isFileExists = existsSync(destinationPath);
      expect(isFileExists).toBeTruthy();
    });
  });
}

function fileCopierErrorsTests() {
  describe('FileCopier Errors', () => {
    it('should throw an error if source file is not an idml file(.idml extension)', async () => {
      const sourcePath = path.join(`${tmpdir()}/sample.txt`);
      const destinationPath = sourcePath;
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const result = await fileCopier.copy();
      expect(result).toMatchObject(ERRORS.MUST_HAVE_IDML_EXT);
    });

    it('should throw an error if destination file path not absolute', async () => {
      const sourcePath = path.join(`${tmpdir()}/fake.idml`);
      const destinationPath = 'destinationPath';
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const result = await fileCopier.copy();
      expect(result).toMatchObject(ERRORS.NOT_ABSOLUTE_PATH);
    });

    it('should throw an error if source file path not found', async () => {
      const sourcePath = path.join(`${tmpdir()}/noPath/fake.idml`);
      const destinationPath = path.join(`${tmpdir()}/noPath/fake.idml`);
      const fileCopier = new FileCopier({ sourcePath, destinationPath });
      const result = await fileCopier.copy();
      expect(result).toMatchObject(ERRORS.FILE_NOT_FOUND);
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
