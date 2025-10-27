import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDocumentoscargadosengancheDto {
  @IsOptional()
  _id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  grupodocumento_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  documento_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  fecha_expedicion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  fecha_vencimiento: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  categoria: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  codigo_referencia: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  observaciones: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  entidad_emisora: string;

  @ApiProperty()
  documento: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  placa_enganche: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;

  @IsNumber()
  @ApiProperty()
  estado_documento: number;
}
