import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAuditoriadocumentosengancheDto } from './create-auditoriadocumentosenganche.dto';
import { EstadoAuditoriaDocumentosEnganche } from '../entities/estado-auditoria-documentosenganche.enum';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAuditoriadocumentosengancheDto extends PartialType(CreateAuditoriadocumentosengancheDto) {
  @ApiPropertyOptional({ enum: EstadoAuditoriaDocumentosEnganche, example: 'ACEPTADO' })
  estado?: EstadoAuditoriaDocumentosEnganche;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiPropertyOptional({ example: 'El documento fue validado correctamente.' })
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true, description: 'Indica si el documento fue verificado por el auditor' })
  verificado?: boolean;
}

