import { IDMLExtractorError } from '@src/libs/CustomError/IDMLExtractorError';
import { ZipExtractor } from '@src/libs/ZipExtractor/ZipExtractor';
import { getFilePaths } from '@src/__testUtils__/ZipExtractor/Utils';
import { ZipExtractorTestSetUp } from '@src/__testUtils__/ZipExtractor/ZipExtractorTestSetUp';
import { readFileSync } from 'fs';
import path from 'path';
import { ZipExtractorTestCleanUp } from '../../__testUtils__/ZipExtractor/ZipExtractorTestCleanUp';

const { sampleTextFile, exampleZipFile, sourcePath, destinationPath, fakeZipFile, zipDestination } = getFilePaths();

beforeAll(ZipExtractorTestSetUp({ sampleTextFile, exampleZipFile }));

afterAll(ZipExtractorTestCleanUp({ exampleZipFile, sampleTextFile, zipDestination }));

describe('ZipExtractor', () => {
  ZipExtractorInitializationTest();
  ZipExtractorErrorsTest();
  ZipExtractorImplementationTest();
});

function ZipExtractorInitializationTest(): void {
  const zipExtractor = new ZipExtractor({ sourcePath, destinationPath });
  const spyonUnZipMethod = jest.spyOn(zipExtractor, 'unZip');
  describe('Create and instance of ZipExtractor and call unZip Method', () => {
    it('should be able to call new() on ZipExtractor', () => {
      expect(zipExtractor).toBeTruthy();
    });

    it('should call unZip method', async () => {
      const result = zipExtractor.unZip();
      Promise.resolve(result).catch((error) => error);
      expect(spyonUnZipMethod).toBeCalled();
    });
  });
}

function ZipExtractorErrorsTest() {
  describe('Error checks', () => {
    it('should throw an error if the sourcePath file extension is not zip', async () => {
      expect.assertions(2);
      const zipExtractor = new ZipExtractor({ sourcePath, destinationPath });
      const [result, error] = await zipExtractor.unZip();
      expect(result).toBeNull();
      expect(error).toMatchObject(new IDMLExtractorError('Provided file is not a ZIP file'));
    });

    it('should throw an error if sourcePath not found', async () => {
      expect.assertions(2);
      const zipExtractor = new ZipExtractor({ sourcePath: fakeZipFile, destinationPath });
      const [result, error] = await zipExtractor.unZip();
      expect(result).toBeNull();
      expect(error).toMatchObject(new IDMLExtractorError('File not found'));
    });

    it('should throw an error is the destinationPath is not absolute', async () => {
      expect.assertions(2);
      const zipper = new ZipExtractor({ sourcePath: exampleZipFile, destinationPath: 'destinationPath' });
      const [result, error] = await zipper.unZip();
      expect(result).toBeNull();
      expect(error).toMatchObject(new IDMLExtractorError('Target directory is expected to be absolute'));
    });
  });
}

function ZipExtractorImplementationTest(): void {
  describe('Extract contents of zip file', () => {
    it('should contain a file with content `Hello World!!!!`', async () => {
      const zipExtractor = new ZipExtractor({ sourcePath: exampleZipFile, destinationPath: zipDestination });
      const result = zipExtractor.unZip();
      await Promise.resolve(result).catch((error) => error);
      const fileData = readFileSync(path.join(zipDestination, 'sample.txt'), { encoding: 'utf-8' });
      expect(fileData).toStrictEqual('Hello World!!!!');
    });
  });
}
