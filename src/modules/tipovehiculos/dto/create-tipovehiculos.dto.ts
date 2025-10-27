import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTipovehiculosDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_tipovehiculo: string;
}
