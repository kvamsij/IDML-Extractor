export type FilePaths = {
  sourcePath: string;
  destinationPath: string;
};

export type FolderSystemFilePaths = {
  fileCopierFilePaths: FilePaths;
  fileRenameFilePaths: FilePaths;
  zipExtractorFilePaths: FilePaths;
};

export interface IFolderSystem {
  getFilePaths(): FolderSystemFilePaths;
}
