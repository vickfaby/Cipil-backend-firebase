import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTipocarroceriaDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_tipocarroceria: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  detalle_tipocarroceria: string;
}
