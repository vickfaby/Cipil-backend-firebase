import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSeguridadsocialeDto {
  @IsOptional()
  _id: string;
  @IsOptional()
  id: string;

  @IsNumber()
  @MinLength(1)
  @ApiProperty()
  estado_afiliacion: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  fecha_afiliacion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  grupoentidad_id: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  observaciones: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  resume_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;

  @IsBoolean()
  @MinLength(1)
  @ApiProperty()
  status: boolean;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipoentidad_id: string;
}
