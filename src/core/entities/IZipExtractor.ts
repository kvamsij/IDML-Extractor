export interface IZipExtractor {
  unZip(sourcePath: string, destinationPath: string): Promise<void>;
}
