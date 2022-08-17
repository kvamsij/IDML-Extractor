import { rmSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';

const SAMPLE_TEXT_FILE = `${tmpdir()}/sample.txt`;
const FAKE_IDML_FILE = `${tmpdir()}/fake.idml`;
const FAKE_FOLDER = `${tmpdir()}/FakeFolder`;

export function testCleanUp(): jest.ProvidesHookCallback {
  return () => {
    rmSync(SAMPLE_TEXT_FILE);
    rmSync(FAKE_FOLDER, { recursive: true });
  };
}
export function testSetUp(): jest.ProvidesHookCallback {
  return async () => {
    await writeFile(SAMPLE_TEXT_FILE, 'Sample a text for test.');
    await writeFile(FAKE_IDML_FILE, 'Fake idml file for test.');
    await mkdir(FAKE_FOLDER);
  };
}
