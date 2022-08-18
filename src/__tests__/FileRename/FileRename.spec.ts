import { FileRename } from '@src/core/usecase/FileRename';

import { existsSync, rmSync } from 'fs';
import { rename, mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

const mockRename = jest.fn(async (filePath: string): Promise<void> => {
  if (path.extname(filePath) !== '.idml') throw new Error('Provided file is not an idml file');
  if (!existsSync(filePath)) throw new Error('File not found');
  const { dir, name } = path.parse(filePath);
  const newFilePath = path.join(dir, 'test', `${name}.zip`);
  await rename(filePath, newFilePath);
});

jest.mock('@src/core/usecase/FileRename', () => ({
  FileRename: jest.fn().mockImplementation(() => ({ rename: mockRename })),
}));

beforeAll(async () => {
  await mkdir(`${tmpdir()}/FakeFolder/test`, { recursive: true });
  await writeFile(`${tmpdir()}/FakeFolder/fake.idml`, 'Sample test for fake idml file');
});

afterAll(() => {
  rmSync(`${tmpdir()}/FakeFolder`, { recursive: true });
});

beforeEach(async () => {
  if (!existsSync(`${tmpdir()}/FakeFolder/fake.idml`))
    await writeFile(`${tmpdir()}/FakeFolder/fake.idml`, 'Sample test for fake idml file');
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
      const fileRename = new FileRename();
      await fileRename.rename(`${tmpdir()}/FakeFolder/fake.idml`);
      const isZipExists = existsSync(`${tmpdir()}/FakeFolder/test/fake.zip`);
      expect(isZipExists).toBeTruthy();
    });

    it('should called with given file path', async () => {
      const fileRename = new FileRename();
      try {
        await fileRename.rename(`${tmpdir()}/FakeFolder/fake.idml`);
      } catch {
        // ignore errors
      } finally {
        expect(mockRename.mock.calls[0][0]).toEqual(`${tmpdir()}/FakeFolder/fake.idml`);
      }
    });
  });
}

function FileRenameErrorsTest() {
  describe('FileRename Errors', () => {
    it('should throw an error if the filePath does not exists', async () => {
      const fileRename = new FileRename();
      const response = fileRename.rename('./example.idml');
      await expect(response).rejects.toThrowError('File not found');
    });

    it('should throw an error if the given file extension is not .idml', async () => {
      const fileRename = new FileRename();
      const response = fileRename.rename(`${tmpdir()}/FakeFolder/fake.txt`);
      await expect(response).rejects.toThrowError('Provided file is not an idml file');
    });
  });
}

function FileRenameClassInitializerTest() {
  describe('FileRename class Initialization', () => {
    it('should be able to call new() on FileRename', () => {
      const fileRename = new FileRename();
      expect(fileRename).toBeTruthy();
    });
    it('rename method should have been called once', async () => {
      const fileRename = new FileRename();

      try {
        await fileRename.rename('./example.txt');
      } catch {
        // ignore errors
      } finally {
        expect(mockRename).toHaveBeenCalledTimes(1);
      }
    });
  });
}
