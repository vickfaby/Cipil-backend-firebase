import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMarcasvehiculoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_marcavehiculo: string;
}
