export function GetFilePathsUtils() {
  const rootBucket = process.env.ROOT_BUCKET ?? 'IDMLExtractorFileSystem';
  const idmlFileBucket = process.env.IDML_FILE_BUCKET ?? 'idml-files';
  const zipFileBucket = process.env.ZIP_FILE_BUCKET ?? 'zip-files';
  const unZipFileBucket = process.env.UNZIP_FILE_BUCKET ?? 'unzip-files';
  return { rootBucket, idmlFileBucket, zipFileBucket, unZipFileBucket };
}
