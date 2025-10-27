import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTipopersonaDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_tipopersona: string;
}
