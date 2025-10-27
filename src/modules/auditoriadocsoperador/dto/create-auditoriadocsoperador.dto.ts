import { IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoAuditoriaDocOperador } from '../entities/estado-auditoria.enum';

export class CreateAuditoriadocsoperadorDto {
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
  @IsEnum(EstadoAuditoriaDocOperador)
  @ApiProperty({ enum: EstadoAuditoriaDocOperador, required: false, example: 'PENDIENTE' })
  estado?: EstadoAuditoriaDocOperador;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false, example: 'Documento borroso, por favor cargar nuevamente en alta resolución.' })
  mensaje?: string;
}


