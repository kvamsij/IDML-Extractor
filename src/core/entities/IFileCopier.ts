export interface IFileCopier {
  copy(sourcePath: string, destinationPath: string): Promise<void>;
}
