export interface ICustomLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}
