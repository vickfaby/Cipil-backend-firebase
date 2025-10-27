import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ActiveAuthDto {
  @IsString()
  @IsEmail({}, { message: 'Este campo debe ser un email valido' })
  @IsOptional()
  @ApiProperty()
  correo: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  nombre: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  token: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  estado: boolean;
}
