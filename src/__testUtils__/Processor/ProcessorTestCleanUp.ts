import { rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

export function ProcessorTestCleanUp(): jest.ProvidesHookCallback {
  return async () => {
    const folderToDelete = path.join(tmpdir(), 'rootBucket');
    await rm(folderToDelete, { recursive: true });
  };
}
