import { IDMLExtractorError } from '@src/libs/CustomError/IDMLExtractorError';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { ZipExtractor } from '@src/libs/ZipExtractor/ZipExtractor';
import { CleanUp, CreateFolders, CreateZipFile, GetFilePaths } from '@src/__testUtils__/setUp';
import { readFileSync } from 'node:fs';
import path from 'path';

const filename = 'fakeZip';
let filePaths: FolderSystemFilePaths;
beforeAll(async () => {
  filePaths = GetFilePaths(filename);
  await CreateFolders(filename);
  await CreateZipFile(filePaths.zipExtractorFilePaths.sourcePath);
});
afterEach(() => jest.clearAllMocks());
afterAll(async () => CleanUp());

describe('ZipExtractor', () => {
  ZipExtractorInitializationTest();
  ZipExtractorErrorsTest();
  ZipExtractorImplementationTest();
});
function ZipExtractorInitializationTest() {
  describe('Create and instance of ZipExtractor and call unZip Method', () => {
    it('should be able to call new() on ZipExtractor', () => {
      const { zipExtractorFilePaths } = filePaths;
      const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
      expect(zipExtractor).toBeTruthy();
    });

    it('should call unZip method', async () => {
      const { zipExtractorFilePaths } = filePaths;
      const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
      const spyOnUnZipMethod = jest.spyOn(zipExtractor, 'unZip');
      const result = zipExtractor.unZip();
      Promise.resolve(result).catch((error) => error);
      expect(spyOnUnZipMethod).toBeCalled();
    });
  });
}

function ZipExtractorErrorsTest() {
  describe('Error checks', () => {
    it('should throw an error if the sourcePath file extension is not zip', async () => {
      const { zipExtractorFilePaths } = filePaths;
      zipExtractorFilePaths.sourcePath = `${path.dirname(zipExtractorFilePaths.sourcePath)}/sample.txt`;
      const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
      const result = zipExtractor.unZip();
      await expect(result).rejects.toThrowError(new IDMLExtractorError('Provided file is not a ZIP file'));
    });

    it('should throw an error if sourcePath not found', async () => {
      const { zipExtractorFilePaths } = filePaths;
      zipExtractorFilePaths.sourcePath = `${path.dirname(zipExtractorFilePaths.sourcePath)}/noPathAvailable/sample.zip`;
      const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
      const result = zipExtractor.unZip();
      await expect(result).rejects.toThrowError(new IDMLExtractorError('File not found'));
    });

    it('should throw an error is the destinationPath is not absolute', async () => {
      const { sourcePath } = filePaths.zipExtractorFilePaths;
      const destinationPath = 'destinationPath';
      const zipExtractor = new ZipExtractor({ sourcePath, destinationPath });
      const result = zipExtractor.unZip();
      await expect(result).rejects.toThrowError(new IDMLExtractorError('Target directory is expected to be absolute'));
    });
  });
}

function ZipExtractorImplementationTest() {
  describe('Extract contents of zip file', () => {
    it('should contain a file with content `Hello World!!!!`', async () => {
      const { zipExtractorFilePaths } = GetFilePaths(filename);
      const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
      const result = zipExtractor.unZip();
      await Promise.resolve(result).catch((error) => error);
      const fileData = readFileSync(`${zipExtractorFilePaths.destinationPath}/sample.txt`, {
        encoding: 'utf-8',
      });
      expect(fileData).toStrictEqual('Hello World!!!!');
    });
  });
}
