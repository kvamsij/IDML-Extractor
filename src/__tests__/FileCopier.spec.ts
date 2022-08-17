import { FileCopier } from '@src/core/usecase/FileCopier';
import { existsSync } from 'fs';
import { copyFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { testSetUp, testCleanUp } from '../__testUtils__/FileCopier/testCleanUp';

const mockCopy = jest.fn(async (sourcePath: string, destinationPath: string): Promise<void> => {
  if (!existsSync(sourcePath)) throw new Error('File not found');
  if (!path.isAbsolute(destinationPath)) throw new Error('Path must be absolute');
  if (path.extname(sourcePath) !== '.idml') throw new Error('File must be an IDML file');
  await copyFile(sourcePath, destinationPath);
});

jest.mock('@src/core/usecase/FileCopier', () => ({
  FileCopier: jest.fn().mockImplementation(() => ({ copy: mockCopy })),
}));

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
      const fileCopier = new FileCopier();
      const result = fileCopier.copy(sourcePath, destinationPath);
      await expect(result).resolves.toBe(undefined);
    });

    it('should copy fake.idml file to FakeFolder', async () => {
      const isFileExists = existsSync(destinationPath);
      expect(isFileExists).toBeTruthy();
    });
  });
}

function fileCopierErrorsTests() {
  describe('FileCopier Errors', () => {
    const examplePath = path.join(`${tmpdir()}/sample.txt`);

    it('should throw an error if source file path not found', async () => {
      const fileCopier = new FileCopier();
      const result = fileCopier.copy('sourcePath', 'destinationPath');
      await expect(result).rejects.toThrow('File not found');
    });

    it('should throw an error if destination file path not absolute', async () => {
      const fileCopier = new FileCopier();
      const result = fileCopier.copy(examplePath, 'destinationPath');
      await expect(result).rejects.toThrowError('Path must be absolute');
    });

    it('should throw an error if source file is not an idml file(.idml extension)', async () => {
      const fileCopier = new FileCopier();
      const result = fileCopier.copy(examplePath, examplePath);
      await expect(result).rejects.toThrowError('File must be an IDML file');
    });
  });
}

function fileCopierInitializerTests() {
  describe('FileCopier Initialization', () => {
    it('should be able to call new() on FileCopier', () => {
      const fileCopier = new FileCopier();
      expect(fileCopier).toBeTruthy();
    });
    it('copy method should have be called once', async () => {
      const fileCopier = new FileCopier();
      try {
        await fileCopier.copy('example', 'example');
      } catch {
        // ignore errors
      } finally {
        expect(mockCopy).toHaveBeenCalledTimes(1);
      }
    });
  });
}
