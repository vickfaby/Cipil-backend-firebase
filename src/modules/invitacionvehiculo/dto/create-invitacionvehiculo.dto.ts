import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { EstadoInvitacion } from '../entities/estado-invitacion.enum';

export class CreateInvitacionVehiculoDto {
  @IsOptional()
  _id: string;

  @IsOptional()
  id: string;

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
  mensaje?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty()
  fecha_respuesta?: Date;

  @IsOptional()
  @ApiProperty()
  status?: boolean;
}


