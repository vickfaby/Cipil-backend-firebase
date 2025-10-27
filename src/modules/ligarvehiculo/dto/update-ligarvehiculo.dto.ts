import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateLigarVehiculoDto } from './create-ligarvehiculo.dto';
import { TipoRelacion } from '../entities/tipo-relacion.enum';
import { IsEnum } from 'class-validator';
import { IsString, MinLength } from 'class-validator';

export class UpdateLigarVehiculoDto extends PartialType(CreateLigarVehiculoDto) {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  usuario_a_ligar_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  usuario_invitante_id: string;

  @IsEnum(TipoRelacion)
  @ApiProperty({ enum: TipoRelacion, required: false })
  tipo_relacion?: TipoRelacion;
}


