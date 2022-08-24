export function ConfigSetUpUtils() {
  const rootBucket = process.env.ROOT_BUCKET ?? 'rootBucket';
  const idmlFileBucket = process.env.IDML_FILE_BUCKET ?? 'idmls-files';
  const zipFileBucket = process.env.ZIP_FILE_BUCKET ?? 'zip-files';
  const unZipFileBucket = process.env.UNZIP_FILE_BUCKET ?? 'unzip-files';
  return { rootBucket, idmlFileBucket, zipFileBucket, unZipFileBucket };
}
