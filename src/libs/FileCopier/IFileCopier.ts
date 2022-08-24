export interface IFileCopier {
  copy(): Promise<string>;
}
