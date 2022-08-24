export function GetFilePathsUtils() {
  const rootBucket = process.env.ROOT_BUCKET ? process.env.ROOT_BUCKET : 'nothing';
  const idmlFileBucket = process.env.IDML_FILE_BUCKET ? process.env.IDML_FILE_BUCKET : 'nothing';
  const zipFileBucket = process.env.ZIP_FILE_BUCKET ? process.env.ZIP_FILE_BUCKET : 'nothing';
  const unZipFileBucket = process.env.UNZIP_FILE_BUCKET ? process.env.UNZIP_FILE_BUCKET : 'nothing';
  return { rootBucket, idmlFileBucket, zipFileBucket, unZipFileBucket };
}
