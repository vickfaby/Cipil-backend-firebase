import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateTipodocumentosDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_tipodocumento: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  detalle_tipodocumento: string;
}
