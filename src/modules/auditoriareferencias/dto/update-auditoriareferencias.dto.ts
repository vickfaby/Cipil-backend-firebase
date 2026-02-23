import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAuditoriareferenciasDto } from './create-auditoriareferencias.dto';
import { EstadoAuditoriaReferencia } from '../entities/estado-auditoria-referencia.enum';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAuditoriareferenciasDto extends PartialType(CreateAuditoriareferenciasDto) {
  @ApiPropertyOptional({ enum: EstadoAuditoriaReferencia, example: 'ACEPTADO' })
  estado?: EstadoAuditoriaReferencia;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ example: 'La referencia fue validada correctamente.' })
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true, description: 'Indica si la referencia fue verificada por el auditor' })
  verificado?: boolean;
}

