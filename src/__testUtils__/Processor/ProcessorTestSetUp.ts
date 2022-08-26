import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import JSZip from 'jszip';
import { tmpdir } from 'os';
import path from 'path';

export async function ProcessorTestSetUp(filename: string): Promise<void> {
  const fakeIdmlfilepath = path.join(
    tmpdir(),
    process.env.ROOT_BUCKET ?? 'rootBucket',
    'idmls-files',
    `${filename}.idml`
  );
  if (!existsSync(fakeIdmlfilepath)) writeFile(fakeIdmlfilepath, 'Sample fake file for test');
  const Idmlfilepath = path.join(tmpdir(), process.env.ROOT_BUCKET ?? 'rootBucket', 'idmls-files', 'idmlFile.idml');
  const zip = new JSZip();
  zip.file('sample.txt', 'Hello World!!!!');
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  await writeFile(Idmlfilepath, zipContent);
}
