type FileCopierResults = Promise<{ message: string } | { error: string }>;

export interface IFileCopier {
  copy(): FileCopierResults;
}
