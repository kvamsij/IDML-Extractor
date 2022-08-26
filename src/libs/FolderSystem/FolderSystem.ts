import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { FolderSystemConfig } from '../Config/FolderSystemConfig';
import { FilePaths, FolderSystemFilePaths, IFolderSystem } from './IFolderSystem';

export class FolderSystem implements IFolderSystem {
  private location: string;

  private rootBucket: string;

  private idmlFileBucket: string;

  private zipFileBucket: string;

  private unzipFileBucket: string;

  constructor(private filename: string, private folderSystemConfig: FolderSystemConfig = new FolderSystemConfig()) {
    const { location, rootBucket, idmlFileBucket, zipFileBucket, unzipFileBucket } =
      this.folderSystemConfig.getConfig();
    this.location = location;
    this.rootBucket = rootBucket;
    this.idmlFileBucket = idmlFileBucket;
    this.zipFileBucket = zipFileBucket;
    this.unzipFileBucket = unzipFileBucket;
  }

  async configSetUp(): Promise<void> {
    const rootPath = path.join(this.location, this.rootBucket);
    const folders = [this.idmlFileBucket, this.zipFileBucket, this.unzipFileBucket];

    folders.forEach((folder) => {
      const folderPath = path.join(rootPath, folder);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }
    });
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
