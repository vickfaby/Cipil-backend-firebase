import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateClasesvehiculoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_clasesvehiculos: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  detalle_clasesvehiculos: string;
}
