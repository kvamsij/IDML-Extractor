import { existsSync, rmSync } from 'fs';

export function ZipExtractorTestCleanUp(filePaths: {
  exampleZipFile: string;
  sampleTextFile: string;
  zipDestination: string;
}): jest.ProvidesHookCallback {
  return () => {
    jest.clearAllMocks();
    const { exampleZipFile, sampleTextFile, zipDestination } = filePaths;
    const files = [exampleZipFile, sampleTextFile, zipDestination];
    files.forEach((filePath) => {
      if (existsSync(filePath)) rmSync(filePath, { recursive: true });
    });
  };
}
