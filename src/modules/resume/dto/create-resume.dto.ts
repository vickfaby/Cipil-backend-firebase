import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
} from 'class-validator';
import { CreateDocumentoscargadosresumeDto } from 'src/modules/documentoscargadosresume/dto/create-documentoscargadosresume.dto';
import { CreateReferenciaDto } from 'src/modules/referencias/dto/create-referencia.dto';
import { CreateSeguridadsocialeDto } from 'src/modules/seguridadsociales/dto/create-seguridadsociale.dto';

export class CreateResumeDto {
  @IsOptional()
  _id: string;
  @IsOptional()
  __v: string;

  @IsString()
  @ApiProperty()
  foto: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipodocumento: string;

  @IsOptional()
  @ApiProperty()
  numerodocumento: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  categoria_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipotercero_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipopersona: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  razonsocial: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  apellido: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  sexo: string;

  @IsOptional()
  @ApiProperty()
  telefono: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  direccion: string;

  @IsNumber()
  @ApiProperty()
  pais: number;

  @IsNumber()
  @ApiProperty()
  estado: number;

  @IsNumber()
  @ApiProperty()
  ciudad: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  ubicacion: string;

  @IsOptional()
  @ApiProperty()
  fecha_nacimiento: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  calificacion: string;

  @IsString()
  @ApiProperty()
  progreso: string;

  @IsOptional()
  @ApiProperty()
  entidades_seguridad_social?: CreateSeguridadsocialeDto[];

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @ApiProperty()
  referencias?: CreateReferenciaDto[];

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @ApiProperty()
  documentos?: CreateDocumentoscargadosresumeDto[];

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  usuario_operador_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  usuario_empresa_id?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  status: boolean;
}
