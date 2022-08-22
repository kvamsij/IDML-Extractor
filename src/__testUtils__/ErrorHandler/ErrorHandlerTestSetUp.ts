import { FilePaths } from '@src/core/usecase/ErrorHandler/ErrorHandler';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';

export function ErrorHandlerTestSetUp(testFolder: string, filePaths: FilePaths): jest.ProvidesHookCallback {
  return async () => {
    const { zipFilePath, idmlFilePath, extractedFolderPath } = filePaths;
    const foldersToCreate = [testFolder, extractedFolderPath];
    const filesToCreate = [zipFilePath, idmlFilePath];

    foldersToCreate.forEach(async (folder) => {
      if (!existsSync(folder)) await mkdir(folder);
    });

    filesToCreate.forEach(async (filePath) => {
      if (!existsSync(filePath)) await writeFile(filePath, 'Sample fake file to test');
    });
  };
}
