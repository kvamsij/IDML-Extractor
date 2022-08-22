import { existsSync, rmSync } from 'fs';
import { SAMPLE_TEXT_FILE, FAKE_FOLDER } from './filePaths';

export function testCleanUp(): jest.ProvidesHookCallback {
  return () => {
    rmSync(SAMPLE_TEXT_FILE);
    if (existsSync(FAKE_FOLDER)) rmSync(FAKE_FOLDER, { recursive: true });
  };
}
