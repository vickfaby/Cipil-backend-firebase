import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAuditoriadocsvehiculoDto } from './create-auditoriadocsvehiculo.dto';
import { EstadoAuditoriaDocVehiculo } from '../entities/estado-auditoria-vehiculo.enum';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAuditoriadocsvehiculoDto extends PartialType(CreateAuditoriadocsvehiculoDto) {
  @ApiPropertyOptional({ enum: EstadoAuditoriaDocVehiculo, example: 'ACEPTADO' })
  estado?: EstadoAuditoriaDocVehiculo;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ example: 'Se aprueba el documento, cumple con requisitos.' })
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true, description: 'Indica si el documento fue verificado por el auditor' })
  verificado?: boolean;
}



