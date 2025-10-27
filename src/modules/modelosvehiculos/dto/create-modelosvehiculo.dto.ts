import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateModelosvehiculoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_modelovehiculo: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  marca_vehiculo_ano_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  marca_vehiculo_id: string;
}
