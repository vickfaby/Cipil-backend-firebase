import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAuditoriadocsvehiculoDto } from './create-auditoriadocsvehiculo.dto';
import { EstadoAuditoriaDocVehiculo } from '../entities/estado-auditoria-vehiculo.enum';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAuditoriadocsvehiculoDto extends PartialType(CreateAuditoriadocsvehiculoDto) {
  @ApiPropertyOptional({ enum: EstadoAuditoriaDocVehiculo, example: 'ACEPTADO' })
  estado?: EstadoAuditoriaDocVehiculo;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ example: 'Se aprueba el documento, cumple con requisitos.' })
  mensaje?: string;
}



