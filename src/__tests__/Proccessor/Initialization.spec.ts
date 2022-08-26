import { GetFilePaths, GetProcessorClassInstance } from '@src/__testUtils__/Processor/GetProcessorClassInstance';
import { ProcessorTestCleanUp } from '@src/__testUtils__/Processor/ProcessorTestCleanUp';
import { ProcessorTestSetUp } from '@src/__testUtils__/Processor/ProcessorTestSetUp';
import dontenv from 'dotenv';

dontenv.config();

const filename = 'fakeFile';
let filePaths: any;
let processor: any;
let fileCopier: any;
let fileRename: any;
let zipExtractor: any;
let logger: any;
let errorHandler: any;

beforeAll(async () => {
  filePaths = await GetFilePaths(filename);

  await ProcessorTestSetUp(filename);
  const classInstances = GetProcessorClassInstance(filePaths);
  processor = classInstances.processor;
  fileCopier = classInstances.fileCopier;
  fileRename = classInstances.fileRename;
  zipExtractor = classInstances.zipExtractor;
  logger = classInstances.logger;
  errorHandler = classInstances.errorHandler;
});

afterAll(ProcessorTestCleanUp());

describe('IDML Processor', () => {
  describe('Processor Initialization', () => {
    it('should be able to call new() on Processor class', async () => {
      expect(processor).toBeTruthy();
    });
    it('should have been called with parameters', () => {
      expect(processor).toStrictEqual(
        expect.objectContaining({ fileCopier, fileRename, zipExtractor, logger, errorHandler })
      );
    });
    it('should call process method once', () => {
      const mockProcessMethod = jest.fn();
      jest.spyOn(processor, 'process').mockImplementation(mockProcessMethod);
      processor.process();
      expect(mockProcessMethod).toBeCalledTimes(1);
    });
  });
});
