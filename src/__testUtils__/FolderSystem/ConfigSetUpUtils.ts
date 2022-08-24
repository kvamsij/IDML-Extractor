import { tmpdir } from 'os';

export function ConfigSetUpUtils() {
  const location = process.env.NODE_DEV ? tmpdir() : process.cwd();
  const rootBucket = process.env.ROOT_BUCKET ?? 'rootBucket';
  const idmlFileBucket = process.env.IDML_FILE_BUCKET ?? 'idmls-files';
  const zipFileBucket = process.env.ZIP_FILE_BUCKET ?? 'zip-files';
  const unzipFileBucket = process.env.UNZIP_FILE_BUCKET ?? 'unzip-files';
  return { location, rootBucket, idmlFileBucket, zipFileBucket, unzipFileBucket };
}
