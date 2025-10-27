import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateGrupoentidadeDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  entidad_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_entidad: string;
}
