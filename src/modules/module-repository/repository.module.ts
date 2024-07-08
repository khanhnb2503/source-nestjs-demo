import { Global, Module } from "@nestjs/common";

import { MongoModule } from "~/src/config";
import * as repositories from './repository';

const PROVIDERS_AND_EXPORTS = Object.values(repositories);

@Global()
@Module({
  imports: [MongoModule],
  providers: PROVIDERS_AND_EXPORTS,
  exports: PROVIDERS_AND_EXPORTS
})

export class RepositoryModuleGlobal { }