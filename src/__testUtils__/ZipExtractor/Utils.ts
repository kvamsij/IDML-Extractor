import { existsSync, rmSync, writeFileSync } from 'fs';
import JSZip from 'jszip';
import { tmpdir } from 'os';
import path from 'path';

export const enum FILEPATHS {
  EXAMPLE_TEXT_FILE = 'example.txt',
  EXAMPLE_ZIP_FILE = 'example.zip',
  FAKE_ZIP_FILE = 'fake.zip',
  ZIP_DESTINATION = 'example',
}

const createZipFile = async (filePath: string) => {
  const zip = new JSZip();
  zip.file('sample.txt', 'Hello World!!!!');
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  writeFileSync(filePath, zipContent);
};

export const setUp = async (files: { zipFilePath: string; textFilePath: string }) => {
  const { textFilePath, zipFilePath } = files;
  writeFileSync(textFilePath, 'Sample text file');
  createZipFile(zipFilePath);
};
export function getFilePaths() {
  const getTemporaryfilePath = (filename: string) => path.join(tmpdir(), filename);
  return {
    sampleTextFile: getTemporaryfilePath(FILEPATHS.EXAMPLE_TEXT_FILE),
    exampleZipFile: getTemporaryfilePath(FILEPATHS.EXAMPLE_ZIP_FILE),
    sourcePath: getTemporaryfilePath(FILEPATHS.EXAMPLE_TEXT_FILE),
    destinationPath: getTemporaryfilePath(FILEPATHS.ZIP_DESTINATION),
    fakeZipFile: getTemporaryfilePath(FILEPATHS.FAKE_ZIP_FILE),
    zipDestination: getTemporaryfilePath(FILEPATHS.ZIP_DESTINATION),
  };
}

export const cleanUp = (zipFilePath: string, textFilePath: string, zipFolder: string) => {
  const files = [zipFilePath, textFilePath, zipFolder];
  files.forEach((filePath) => {
    if (existsSync(filePath)) rmSync(filePath, { recursive: true });
  });
};
