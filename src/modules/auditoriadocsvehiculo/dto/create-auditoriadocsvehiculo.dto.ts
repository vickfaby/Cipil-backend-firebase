import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoAuditoriaDocVehiculo } from '../entities/estado-auditoria-vehiculo.enum';

export class CreateAuditoriadocsvehiculoDto {
  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b6', description: 'ID de Resumevehiculo' })
  resumevehiculo_id: string;

  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b7', description: 'ID del documento cargado (Documentoscargadosvehiculo)' })
  documento_cargado_id: string;

  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b8', description: 'ID del usuario auditor' })
  auditor: string;

  @IsOptional()
  @IsEnum(EstadoAuditoriaDocVehiculo)
  @ApiProperty({ enum: EstadoAuditoriaDocVehiculo, required: false, example: 'PENDIENTE' })
  estado?: EstadoAuditoriaDocVehiculo;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false, example: 'Documento borroso, por favor cargar nuevamente en alta resolución.' })
  mensaje?: string;
}



