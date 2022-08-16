import { ZipExtractor } from '@src/core/usecase/ZipExtractor';
import { setUp, getFilePaths, cleanUp } from '@src/__testUtils__/ZipExtractor/Utils';
import { readFileSync } from 'fs';
import path from 'path';

const { exampleZipFile, sampleTextFile, sourcePath, destinationPath, fakeZipFile, zipDestination } = getFilePaths();

beforeAll(() => {
  setUp({ zipFilePath: exampleZipFile, textFilePath: sampleTextFile });
});

afterAll(() => {
  jest.clearAllMocks();
  cleanUp(sampleTextFile, exampleZipFile);
});

describe('ZipExtractor', () => {
  const zipExtractor = new ZipExtractor();

  createInstanceAndCallMethodTest(zipExtractor);
  errorChecksTest(zipExtractor, sourcePath, destinationPath, fakeZipFile, exampleZipFile);
  ExtractZipContentTest(zipExtractor, exampleZipFile, zipDestination);
});

function ExtractZipContentTest(zipExtractor: ZipExtractor, zipFilePath: string, zipDestinationFolder: string): void {
  describe('Extract contents of zip file', () => {
    it('should contain a file with content `Hello World!!!!`', async () => {
      const result = zipExtractor.unZip(zipFilePath, zipDestinationFolder);
      Promise.resolve(result).catch((error) => error);
      const fileData = readFileSync(path.join(zipDestinationFolder, 'sample.txt'), { encoding: 'utf-8' });
      expect(fileData).toStrictEqual('Hello World!!!!');
    });
  });
}

function errorChecksTest(
  zipExtractor: ZipExtractor,
  sourceFilePath: string,
  destinationFilePath: string,
  fakeZipFilePath: string,
  exampleZipFilePath: string
): void {
  describe('Error checks', () => {
    it('should throw an error if the sourcePath file extension is not zip', async () => {
      const result = zipExtractor.unZip(sourceFilePath, destinationFilePath);
      await expect(result).rejects.toThrowError('Provided file is not a ZIP file');
    });

    it('should throw an error if sourcePath not found', async () => {
      const result = zipExtractor.unZip(fakeZipFilePath, destinationFilePath);
      await expect(result).rejects.toThrowError('File not found');
    });

    it('should throw an error is the destinationPath is not absolute', async () => {
      const result = zipExtractor.unZip(exampleZipFilePath, 'destinationPath');
      await expect(result).rejects.toThrowError('DestinationPath must be absolute');
    });
  });
}

function createInstanceAndCallMethodTest(zipExtractor: ZipExtractor): void {
  const spyonUnZipMethod = jest.spyOn(zipExtractor, 'unZip');
  describe('Create and instance of ZipExtractor and call unZip Method', () => {
    it('should be able to call new() on ZipExtractor', () => {
      expect(zipExtractor).toBeTruthy();
    });

    it('should call unZip method', async () => {
      const result = zipExtractor.unZip('sourcePath', 'destinationPath');
      Promise.resolve(result).catch((error) => error);
      expect(spyonUnZipMethod).toBeCalled();
    });
  });
}
