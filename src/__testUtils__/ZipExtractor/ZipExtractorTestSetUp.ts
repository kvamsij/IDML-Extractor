import { writeFile } from 'fs/promises';
import JSZip from 'jszip';

export function ZipExtractorTestSetUp(filePaths: {
  sampleTextFile: string;
  exampleZipFile: string;
}): jest.ProvidesHookCallback {
  return async () => {
    const { sampleTextFile, exampleZipFile } = filePaths;
    await writeFile(sampleTextFile, 'Sample text file');
    const zip = new JSZip();
    zip.file('sample.txt', 'Hello World!!!!');
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
    await writeFile(exampleZipFile, zipContent);
  };
}
