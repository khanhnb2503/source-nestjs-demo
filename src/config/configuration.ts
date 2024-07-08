import { existsSync, readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { merge } from 'lodash';
import { join, resolve } from 'path';

export default () => {
  const env: string | undefined = process.env.NODE_ENV || 'dev';
  const defaultConfig = yaml.load(
    readFileSync(resolve(join(__dirname, `default.yaml`)), 'utf8'),
  );
  let envFileConfig = {};
  const envFilePath: string = resolve(join(__dirname, `${env}.yaml`));

  if (existsSync(envFilePath)) {
    envFileConfig = yaml.load(readFileSync(envFilePath, 'utf8'));
  }

  return merge(defaultConfig, envFileConfig);
};
