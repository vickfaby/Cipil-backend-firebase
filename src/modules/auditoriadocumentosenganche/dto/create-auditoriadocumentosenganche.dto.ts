import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoAuditoriaDocumentosEnganche } from '../entities/estado-auditoria-documentosenganche.enum';

export class CreateAuditoriadocumentosengancheDto {
  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b6', description: 'ID de Resume' })
  resume_id: string;

  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b7', description: 'ID del documento cargado (Documentoscargadosresume)' })
  documento_cargado_id: string;

  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b8', description: 'ID del usuario auditor' })
  auditor: string;

  @IsOptional()
  @IsEnum(EstadoAuditoriaDocumentosEnganche)
  @ApiProperty({ enum: EstadoAuditoriaDocumentosEnganche, required: false, example: 'PENDIENTE' })
  estado?: EstadoAuditoriaDocumentosEnganche;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false, example: 'Documento pendiente por validación.' })
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, example: false, description: 'Indica si el documento fue verificado por el auditor' })
  verificado?: boolean;
}

