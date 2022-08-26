import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';
import { IErrorHandler } from '../ErrorHandler/IErrorHandler';
import { IFileCopier } from '../FileCopier/IFileCopier';
import { IFileRename } from '../FileRename/IFileRename';
import { ICustomLogger } from '../Logger/ICustomLogger';
import { IZipExtractor } from '../ZipExtractor/IZipExtractor';

export class Processor {
  constructor(
    private fileCopier: IFileCopier,
    private fileRename: IFileRename,
    private zipExtractor: IZipExtractor,
    private logger: ICustomLogger,
    private errorHandler: IErrorHandler
  ) {}

  async process(): Promise<void> {
    const { fileCopier, logger, fileRename, zipExtractor, errorHandler } = this;
    try {
      const fileCopierResponse = await fileCopier.copy();
      logger.info(fileCopierResponse);
      const fileRenameResponse = await fileRename.fsRename();
      logger.info(fileRenameResponse);
      const zipExtractorResponse = await zipExtractor.unZip();
      logger.info(zipExtractorResponse);
    } catch (error) {
      if (error instanceof IDMLExtractorError) logger.error(error.message);
      logger.error((error as Error).message);
      logger.info('Starting clean up process....');
      errorHandler.handle();
      logger.info('Finish clean up process');
    }
  }
}
