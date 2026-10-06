import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceAreaDto } from './create-service-area.dto';

export class UpdateServiceAreaDto extends PartialType(CreateServiceAreaDto) {}
