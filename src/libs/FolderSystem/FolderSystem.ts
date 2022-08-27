import path from 'path';
import { FolderSystemConfig } from '../Config/FolderSystemConfig';
import { FilePaths, FolderSystemFilePaths, IFolderSystem } from './IFolderSystem';

export class FolderSystem implements IFolderSystem {
  private location: string;

  private rootBucket: string;

  private idmlFileBucket: string;

  private zipFileBucket: string;

  private unzipFileBucket: string;

  private folderSystemConfig: FolderSystemConfig = new FolderSystemConfig();

  constructor(private filename: string) {
    const { location, rootBucket, idmlFileBucket, zipFileBucket, unzipFileBucket } =
      this.folderSystemConfig.getConfigProperties();
    this.location = location;
    this.rootBucket = rootBucket;
    this.idmlFileBucket = idmlFileBucket;
    this.zipFileBucket = zipFileBucket;
    this.unzipFileBucket = unzipFileBucket;
  }

  getFilePaths(): FolderSystemFilePaths {
    const rootPath = path.join(this.location, this.rootBucket);
    const fileCopierFilePaths = this.constructFileCopierFilePaths(rootPath);
    const fileRenameFilePaths = this.constructFileRenameFilePaths(rootPath);
    const zipExtractorFilePaths = this.constructZipExtractorFilePaths(rootPath);

    return {
      fileCopierFilePaths,
      fileRenameFilePaths,
      zipExtractorFilePaths,
    };
  }

  private constructFileCopierFilePaths(rootDirPath: string): FilePaths {
    const sourcePath = path.join(rootDirPath, this.idmlFileBucket, `${this.filename}.idml`);
    const destinationPath = path.join(rootDirPath, this.zipFileBucket, `${this.filename}.idml`);

    return { sourcePath, destinationPath };
  }

  private constructFileRenameFilePaths(rootDirPath: string): FilePaths {
    const sourcePath = path.join(rootDirPath, this.zipFileBucket, `${this.filename}.idml`);
    const destinationPath = path.join(rootDirPath, this.zipFileBucket, `${this.filename}.zip`);

    return { sourcePath, destinationPath };
  }

  private constructZipExtractorFilePaths(rootDirPath: string): FilePaths {
    const sourcePath = path.join(rootDirPath, this.zipFileBucket, `${this.filename}.zip`);
    const destinationPath = path.join(rootDirPath, this.unzipFileBucket, this.filename);
    return { sourcePath, destinationPath };
  }
}
