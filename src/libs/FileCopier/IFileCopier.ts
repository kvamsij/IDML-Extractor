import { IDMLExtractorError } from '../CustomError/IDMLExtractorError';

export type Response = (IDMLExtractorError | null)[] | (string | null)[];

export interface IFileCopier {
  copy(): Promise<Response>;
}
