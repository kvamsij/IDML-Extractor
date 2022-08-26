import { ErrorHandler } from '@src/libs/ErrorHandler/ErrorHandler';
import { FileCopier } from '@src/libs/FileCopier/FileCopier';
import { FileRename } from '@src/libs/FileRename/FileRename';
import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { CustomLogger } from '@src/libs/Logger/CustomLogger';
import { Processor } from '@src/libs/Processor/Processor';
import { ZipExtractor } from '@src/libs/ZipExtractor/ZipExtractor';

export type ClassInstances = {
  fileCopier: FileCopier;
  fileRename: FileRename;
  zipExtractor: ZipExtractor;
  logger: CustomLogger;
  errorHandler: ErrorHandler;
  processor: Processor;
};

export function GetProcessorClassInstance(filePaths: FolderSystemFilePaths): ClassInstances {
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

  return {
    fileCopier,
    fileRename,
    zipExtractor,
    logger,
    errorHandler,
    processor,
  };
}

export async function GetFilePaths(filename: string): Promise<FolderSystemFilePaths> {
  const folderSystem = new FolderSystem(filename);

  await folderSystem.configSetUp();

  return folderSystem.getFilePaths();
}
