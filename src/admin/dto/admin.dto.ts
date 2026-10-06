import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  bio?: string;
  
  @IsString()
  @IsOptional()
  profilePic?: string;
}

export class UpdateStaffDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  bio?: string;
  
  @IsString()
  @IsOptional()
  profilePic?: string;
  
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
  
  @IsOptional()
  isActive?: boolean;
}
