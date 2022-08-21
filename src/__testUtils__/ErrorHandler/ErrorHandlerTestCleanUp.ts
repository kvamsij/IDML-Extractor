import { existsSync } from 'fs';
import { rm } from 'fs/promises';

export function ErrorHandlerTestCleanUp(testFolder: string): jest.ProvidesHookCallback {
  return async () => {
    if (existsSync(testFolder)) await rm(testFolder, { recursive: true });
  };
}
