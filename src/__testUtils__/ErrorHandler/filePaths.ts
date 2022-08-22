import { FilePaths } from '@src/libs/ErrorHandler/ErrorHandler';
import { tmpdir } from 'os';
import path from 'path';

export const testFolder = path.join(tmpdir(), 'ErrorHandlerTest');
export const filePaths: FilePaths = {
  zipFilePath: path.join(testFolder, 'fakeZip.zip'),
  idmlFilePath: path.join(testFolder, 'fakeIdml.idml'),
  extractedFolderPath: path.join(testFolder, 'FakeFolder'),
};
