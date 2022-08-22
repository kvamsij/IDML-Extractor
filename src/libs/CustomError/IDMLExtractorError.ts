export class IDMLExtractorError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, IDMLExtractorError.prototype);
  }
}
