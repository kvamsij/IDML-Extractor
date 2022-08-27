import { ErrorHandler } from './libs/ErrorHandler/ErrorHandler';
import { ErrorHandlerFilePaths } from './libs/ErrorHandler/IErrorHandler';
import { FileCopier } from './libs/FileCopier/FileCopier';
import { FileRename } from './libs/FileRename/FileRename';
import { FolderSystem } from './libs/FolderSystem/FolderSystem';
import { CustomLogger } from './libs/Logger/CustomLogger';
import { Processor } from './libs/Processor/Processor';
import { ZipExtractor } from './libs/ZipExtractor/ZipExtractor';

export class IDMLExtractor {
  constructor(private filename: string) {
    //
  }

  runProcess() {
    const folderSystem = new FolderSystem(this.filename);
    const { fileCopierFilePaths, fileRenameFilePaths, zipExtractorFilePaths } = folderSystem.getFilePaths();

    const errorHandlerFilePaths: ErrorHandlerFilePaths = {
      zipFilePath: fileRenameFilePaths.destinationPath,
      extractedFolderPath: zipExtractorFilePaths.destinationPath,
      idmlFilePath: fileCopierFilePaths.sourcePath,
    };

    const fileCopier = new FileCopier(fileCopierFilePaths);
    const fileRename = new FileRename(fileRenameFilePaths.sourcePath);
    const zipExtractor = new ZipExtractor(zipExtractorFilePaths);
    const logger = new CustomLogger();
    const errorHandler = new ErrorHandler(errorHandlerFilePaths);
    const processor = new Processor(fileCopier, fileRename, zipExtractor, logger, errorHandler);

    processor.process();
  }
}
