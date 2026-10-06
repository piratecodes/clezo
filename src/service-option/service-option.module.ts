import { Module } from '@nestjs/common';
import { ServiceOptionController } from './service-option.controller';
import { ServiceOptionService } from './service-option.service';

@Module({
  controllers: [ServiceOptionController],
  providers: [ServiceOptionService]
})
export class ServiceOptionModule {}
