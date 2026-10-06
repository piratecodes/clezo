import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateServiceAreaRangeDto {
  @IsString()
  @IsNotEmpty()
  fromPincode: string;

  @IsString()
  @IsNotEmpty()
  toPincode: string;

  @IsString()
  @IsNotEmpty()
  areaName: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  localities?: string[];
}
