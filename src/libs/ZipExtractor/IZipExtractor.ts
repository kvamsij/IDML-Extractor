import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';

export type Response = (IDMLExtractorError | null)[] | (string | null)[];
export interface IZipExtractor {
  unZip(sourcePath: string, destinationPath: string): Promise<Response>;
}
