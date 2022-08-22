type FileRenameResults = Promise<{ message: string } | { error: string } | undefined>;

export interface IFileRename {
  fsRename(): FileRenameResults;
}
