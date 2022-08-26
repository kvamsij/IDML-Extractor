import { DefaultConfig } from './DefaultConfig';

export type FolderSystemConfigProperties = {
  location: string;
  rootBucket: string;
  idmlFileBucket: string;
  zipFileBucket: string;
  unzipFileBucket: string;
};
export class FolderSystemConfig extends DefaultConfig {
  getConfig(): FolderSystemConfigProperties {
    return this.getConfigProperties() as FolderSystemConfigProperties;
  }
}
