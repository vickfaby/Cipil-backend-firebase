import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAuditoriadocsoperadorDto } from './create-auditoriadocsoperador.dto';
import { EstadoAuditoriaDocOperador } from '../entities/estado-auditoria.enum';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAuditoriadocsoperadorDto extends PartialType(CreateAuditoriadocsoperadorDto) {
  @ApiPropertyOptional({ enum: EstadoAuditoriaDocOperador, example: 'ACEPTADO' })
  estado?: EstadoAuditoriaDocOperador;

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


