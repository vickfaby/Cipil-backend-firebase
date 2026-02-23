import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoAuditoriaReferencia } from '../entities/estado-auditoria-referencia.enum';

export class CreateAuditoriareferenciasDto {
  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b6', description: 'ID de Resume' })
  resume_id: string;

  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b7', description: 'ID de la referencia' })
  referencia_id: string;

  @IsMongoId()
  @ApiProperty({ example: '6710d1c2f2a4b1e2d3c4a5b8', description: 'ID del usuario auditor' })
  auditor: string;

  @IsOptional()
  @IsEnum(EstadoAuditoriaReferencia)
  @ApiProperty({ enum: EstadoAuditoriaReferencia, required: false, example: 'PENDIENTE' })
  estado?: EstadoAuditoriaReferencia;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false, example: 'Referencia pendiente por validación de datos.' })
  mensaje?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, example: false, description: 'Indica si la referencia fue verificada por el auditor' })
  verificado?: boolean;
}

