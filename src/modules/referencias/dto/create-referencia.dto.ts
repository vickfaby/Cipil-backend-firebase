import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateReferenciaDto {
  @IsOptional()
  _id: string;

  @IsOptional()
  id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_completo: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  telefonos: number;

  @IsNumber()
  @ApiProperty()
  pais_referencia: number;

  @IsNumber()
  @ApiProperty()
  estado_referencia: number;

  @IsNumber()
  @ApiProperty()
  ciudad_referencia: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  direccion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  relacion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  resume_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  status: string;
}
