import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { DefaultConfig } from './DefaultConfig';

export class FolderSystemConfig extends DefaultConfig {
  async configSetUp(): Promise<void> {
    const { location, rootBucket, idmlFileBucket, zipFileBucket, unzipFileBucket } = this.getConfigProperties();
    const rootPath = path.join(location, rootBucket);
    const folders = [idmlFileBucket, zipFileBucket, unzipFileBucket];

    folders.forEach((folder) => {
      const folderPath = path.join(rootPath, folder);
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }
    });
  }
}
