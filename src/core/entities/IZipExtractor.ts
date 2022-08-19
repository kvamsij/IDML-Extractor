type UnZipResults = Promise<{ message: string } | { error: string } | undefined>;

export interface IZipExtractor {
  unZip(sourcePath: string, destinationPath: string): UnZipResults;
}
