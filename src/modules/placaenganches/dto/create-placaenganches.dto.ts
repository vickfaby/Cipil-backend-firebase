import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class CreatePlacaenganchesDto {
  @IsNumber()
  @ApiProperty()
  capacidad: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  color_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  configuracionvehicular: string;

  @IsString()
  @ApiProperty()
  foto: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  marca_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  linea?: string;

  @IsNumber()
  @Min(1900)
  @Max(2100)
  @ApiProperty({ description: 'Año modelo del enganche, ej: 2020' })
  modelo: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  numero_serie: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numero_plaqueta?: string;

  @IsNumber()
  @ApiProperty()
  peso: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  largo?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  ancho?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  alto?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  s1?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  s2?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  s3?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  s4?: string;

  @IsString()
  @ApiProperty()
  placa: string;

  @IsString()
  @ApiProperty()
  propietario_id: string;

  @IsString()
  @ApiProperty()
  tenedor_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipocarroceria_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;
}
