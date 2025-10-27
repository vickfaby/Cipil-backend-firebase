import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateGrupodocumentoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_grupodocumento: string;
}
