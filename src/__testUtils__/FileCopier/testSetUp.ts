import { mkdir, writeFile } from 'fs/promises';
import { SAMPLE_TEXT_FILE, FAKE_IDML_FILE, FAKE_FOLDER } from './filePaths';

export function testSetUp(): jest.ProvidesHookCallback {
  return async () => {
    await writeFile(SAMPLE_TEXT_FILE, 'Sample a text for test.');
    await writeFile(FAKE_IDML_FILE, 'Fake idml file for test.');
    await mkdir(FAKE_FOLDER);
  };
}
