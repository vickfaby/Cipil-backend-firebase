import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTiporelacionesDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_tiporelacion: string;
}
