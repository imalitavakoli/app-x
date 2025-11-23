import { PromiseExecutor } from '@nx/devkit';
import { FinV1ExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<FinV1ExecutorSchema> = async (options) => {
  console.log('Executor ran for FinV1', options);
  return {
    success: true,
  };
};

export default runExecutor;
