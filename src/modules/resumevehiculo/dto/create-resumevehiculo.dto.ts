import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CreateDocumentoscargadosengancheDto } from 'src/modules/documentoscargadosenganche/dto/create-documentoscargadosenganche.dto';
import { CreateDocumentoscargadosvehiculoDto } from 'src/modules/documentoscargadosvehiculo/dto/create-documentoscargadosvehiculo.dto';

export class CreateResumevehiculoDto {
  @IsOptional()
  _id: string;
  @IsOptional()
  __v: string;

  @IsOptional()
  enganche?: string[];

  @IsArray()
  @ApiProperty()
  fotos: string[];

  @IsString()
  @MinLength(1)
  @ApiProperty()
  placa: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipovehiculo_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  marca_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  ano_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  modelo_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  modelo: string;

  @IsOptional()
  @ApiProperty()
  modelo_repotenciado: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  color_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipocarroceria_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  clasevehiculo_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  configuracionvehicular: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numero_motor: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numero_serie: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numero_chasis: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  peso_vacio: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  capacidad: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  propietario_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tenedor_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  operador_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipo_servicio: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  empresagps_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  paginaweb_gps: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  usuario_gps: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  clave_gps: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  ubicacion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  calificacion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  ruta_frecuente: string;

  @IsOptional()
  @ApiProperty()
  placa_enganche: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  documentosvehiculo?: CreateDocumentoscargadosvehiculoDto[];

  @IsArray()
  @IsOptional()
  @ApiProperty()
  documentosenganche?: CreateDocumentoscargadosengancheDto[];

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  progreso: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;

  @IsBoolean()
  @ApiProperty()
  status: boolean;

  // Datos propietarios/tenedor/operador
  @IsOptional()
  @IsString()
  @ApiProperty()
  tipo_doc_propietario_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  num_documento_propietario?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email_propietario?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  tipo_doc_tenedor_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  num_documento_tenedor?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email_tenedor?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  tipo_doc_operador_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  num_documento_operador?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email_operador?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  tenedor_liga_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  propietario_liga_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  operador_liga_id?: string;
}
