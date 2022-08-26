// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable class-methods-use-this */

import dotenv from 'dotenv';
import { existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { FilePaths, FolderSystemFilePaths, IFolderSystem } from './IFolderSystem';

dotenv.config();

export class FolderSystem implements IFolderSystem {
  private location: string;

  private rootBucket: string;

  private idmlFileBucket: string;

  private zipFileBucket: string;

  private unzipFileBucket: string;

  constructor(private filename: string) {
    this.location = process.env.NODE_DEV === 'true' ? process.cwd() : tmpdir();
    this.rootBucket = process.env.ROOT_BUCKET ?? 'rootBucket';
    this.idmlFileBucket = process.env.IDML_FILE_BUCKET ?? 'idmls-files';
    this.zipFileBucket = process.env.ZIP_FILE_BUCKET ?? 'zip-files';
    this.unzipFileBucket = process.env.UNZIP_FILE_BUCKET ?? 'unzip-files';
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
