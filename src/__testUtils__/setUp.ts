import { FolderSystem } from '@src/libs/FolderSystem/FolderSystem';
import { FolderSystemFilePaths } from '@src/libs/FolderSystem/IFolderSystem';
import { rm, writeFile } from 'fs/promises';
import JSZip from 'jszip';
import { tmpdir } from 'os';

export function GetFilePaths(filename: string): FolderSystemFilePaths {
  const folderSystem = new FolderSystem(filename);
  return folderSystem.getFilePaths();
}

export async function CreateFolders(filename: string): Promise<void> {
  await new FolderSystem(filename).configSetUp();
}

export async function CreateZipFile(filePath: string) {
  const zip = new JSZip();
  zip.file('sample.txt', 'Hello World!!!!');
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  await writeFile(filePath, zipContent);
}

export async function CreateTextFile(filePath: string) {
  await writeFile(filePath, 'Sample text file');
}

export async function CleanUp() {
  await rm(`${tmpdir()}/rootBucket`, { recursive: true, force: true });
}
