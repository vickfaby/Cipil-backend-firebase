import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateDocumentoscargadosengancheDto } from 'src/modules/documentoscargadosenganche/dto/create-documentoscargadosenganche.dto';
import { CreateDocumentoscargadosvehiculoDto } from 'src/modules/documentoscargadosvehiculo/dto/create-documentoscargadosvehiculo.dto';

export class CreateEngancheDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'ID de la marca del enganche' })
  marca_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Modelo del enganche' })
  modelo: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Número de serie del enganche' })
  numero_serie: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'ID del color del enganche' })
  color_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'ID del tipo de carrocería (Cama baja, Botellero, Cama alta)' })
  tipocarroceria_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Número de plaqueta del enganche', required: false })
  numero_plaqueta?: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Placa del enganche' })
  placa: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Largo del enganche en metros', required: false })
  largo?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Ancho del enganche en metros', required: false })
  ancho?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Alto del enganche en metros', required: false })
  alto?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Configuración de ejes - Eje s1', required: false })
  s1?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Configuración de ejes - Eje s2', required: false })
  s2?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Configuración de ejes - Eje s3', required: false })
  s3?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Configuración de ejes - Eje s4', required: false })
  s4?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Configuración vehicular del enganche', required: false })
  configuracionvehicular?: string;

  @IsNumber()
  @ApiProperty({ description: 'Peso del enganche en kg' })
  peso: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Capacidad del enganche', required: false })
  capacidad?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'URL o path de la foto del enganche', required: false })
  foto?: string;
}

export class CreateResumevehiculoDto {
  @IsOptional()
  _id: string;
  @IsOptional()
  __v: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateEngancheDto)
  @ApiProperty({ 
    description: 'Datos del enganche (requerido cuando tipo de vehículo es ARTICULADO). Debe enviarse como objeto anidado, NO con prefijos enganche_', 
    required: false,
    type: CreateEngancheDto
  })
  enganche?: CreateEngancheDto;

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

  // Datos propietario
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_nombre?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_apellido?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_telefono?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_numdocumento?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  propietario_tipodocumento?: string;

  // Datos tenedor
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_nombre?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_apellido?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_telefono?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_numdocumento?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  tenedor_tipodocumento?: string;

  // Datos operador
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_nombre?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_apellido?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_telefono?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_numdocumento?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  operador_tipodocumento?: string;

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

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  disponible: boolean;

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
