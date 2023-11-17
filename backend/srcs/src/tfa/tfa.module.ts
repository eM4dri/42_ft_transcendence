import { Module } from '@nestjs/common';
import { TfaController } from './tfa.controller';
import { TfaService } from './tfa.service';

@Module({
  controllers: [TfaController],
  providers: [TfaService]
})
export class TfaModule {}
