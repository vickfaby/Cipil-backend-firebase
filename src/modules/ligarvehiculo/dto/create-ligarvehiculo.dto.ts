import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoInvitacion } from '../entities/estado-invitacion.enum';
import { TipoRelacion } from '../entities/tipo-relacion.enum';

export class CreateLigarVehiculoDto {
  @IsOptional()
  _id: string;

  @IsOptional()
  id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  usuario_a_ligar_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  usuario_invitante_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  resume_vehiculo_id: string;

  @IsOptional()
  @IsEnum(EstadoInvitacion)
  @ApiProperty({ enum: EstadoInvitacion })
  estado_invitacion?: EstadoInvitacion;

  @IsOptional()
  @IsString()
  @ApiProperty()
  correo_a_ligar?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  mensaje?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  fecha_respuesta?: Date;

  @IsOptional()
  @ApiProperty()
  status?: boolean;

  @IsEnum(TipoRelacion)
  @ApiProperty({ enum: TipoRelacion })
  tipo_relacion: TipoRelacion;
}


