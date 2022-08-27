import { tmpdir } from 'os';
import dotenv from 'dotenv';

export type ConfigProperties = {
  location: string;
  rootBucket: string;
  idmlFileBucket: string;
  zipFileBucket: string;
  unzipFileBucket: string;
};
dotenv.config();

export class DefaultConfig {
  private defaultConfigProperties: ConfigProperties = {
    location: process.env.NODE_DEV === 'true' ? tmpdir() : process.cwd(),
    rootBucket: 'IDMLExtractorFileSystem',
    idmlFileBucket: 'idmls-files',
    zipFileBucket: 'zip-files',
    unzipFileBucket: 'unzip-files',
  };

  private envConfigProperties: ConfigProperties = {
    location: process.env.NODE_DEV === 'true' ? tmpdir() : process.cwd(),
    rootBucket: process.env.ROOT_BUCKET ?? '',
    idmlFileBucket: process.env.IDML_FILE_BUCKET ?? '',
    zipFileBucket: process.env.ZIP_FILE_BUCKET ?? '',
    unzipFileBucket: process.env.UNZIP_FILE_BUCKET ?? '',
  };

  getConfigProperties() {
    return this.isEnvSet() ? this.envConfigProperties : this.defaultConfigProperties;
  }

  isEnvSet(): boolean {
    const FALSY_VALUES = ['', 'null', 'false', 'true', 'undefined'];
    const envValues = Object.values(this.envConfigProperties).map((value) => {
      if (!value || FALSY_VALUES.includes(value)) return false;
      return true;
    });
    const uniqueValues = new Set(envValues);
    if (uniqueValues.size === 1 && uniqueValues.has(true)) return true;
    return false;
  }
}
