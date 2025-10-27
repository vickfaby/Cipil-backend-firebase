import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTipoterceroDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_tercero: string;
}
