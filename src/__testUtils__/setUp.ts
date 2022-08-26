import { ErrorHandler } from '@src/libs/ErrorHandler/ErrorHandler';
import { FileCopier } from '@src/libs/FileCopier/FileCopier';
import { FileRename } from '@src/libs/FileRename/FileRename';
import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { CustomLogger } from '@src/libs/Logger/CustomLogger';
import { Processor } from '@src/libs/Processor/Processor';
import { ZipExtractor } from '@src/libs/ZipExtractor/ZipExtractor';
import { rm, writeFile } from 'fs/promises';
import JSZip from 'jszip';
import { tmpdir } from 'os';

type MocksType = {
  copyMethodSpy: jest.SpyInstance<Promise<string>, []>;
  fsRenameMethodSpy: jest.SpyInstance<Promise<string>, []>;
  unZipMethodSpy: jest.SpyInstance<Promise<string>, []>;
  loggerInfoSpy: jest.SpyInstance<void, [message: string]>;
  loggerErrorSpy: jest.SpyInstance<void, [message: string]>;
  errorHandlerSpy: jest.SpyInstance<void, []>;
};
export type GetClassInstanceAndMocksResults = {
  processor: Processor;
  mocks: MocksType;
};
export function GetFilePaths(filename: string): FolderSystemFilePaths {
  const folderSystem = new FolderSystem(filename);
  return folderSystem.getFilePaths();
}

export async function CreateFolders(filename: string): Promise<void> {
  await new FolderSystem(filename).configSetUp();
}

export async function CreateZipFile(filePath: string) {
  const zip = new JSZip();
  zip.file('sample.txt', 'Hello World!!!!');
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  await writeFile(filePath, zipContent);
}

export async function CreateTextFile(filePath: string) {
  await writeFile(filePath, 'Sample text file');
}

export async function CleanUp() {
  await rm(`${tmpdir()}/rootBucket`, { recursive: true, force: true });
}

export function GetClassInstanceAndMocks(filePaths: FolderSystemFilePaths): GetClassInstanceAndMocksResults {
  const { fileCopierFilePaths, fileRenameFilePaths, zipExtractorFilePaths } = filePaths;
  const fileCopier = new FileCopier(fileCopierFilePaths);
  const fileRename = new FileRename(fileRenameFilePaths.sourcePath);
  const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
  const logger = new CustomLogger();
  const errorHandler = new ErrorHandler({
    zipFilePath: fileRenameFilePaths.sourcePath,
    idmlFilePath: fileCopierFilePaths.sourcePath,
    extractedFolderPath: zipExtractorFilePaths.destinationPath,
  });
  const processor = new Processor(fileCopier, fileRename, zipExtractor, logger, errorHandler);
  const copyMethodSpy = jest.spyOn(fileCopier, 'copy');
  const fsRenameMethodSpy = jest.spyOn(fileRename, 'fsRename');
  const unZipMethodSpy = jest.spyOn(zipExtractor, 'unZip');
  const loggerInfoSpy = jest.spyOn(logger, 'info');
  const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
  const errorHandlerSpy = jest.spyOn(errorHandler, 'handle');

  return {
    processor,
    mocks: {
      copyMethodSpy,
      fsRenameMethodSpy,
      unZipMethodSpy,
      loggerInfoSpy,
      loggerErrorSpy,
      errorHandlerSpy,
    },
  };
}
