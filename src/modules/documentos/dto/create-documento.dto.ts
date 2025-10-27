import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateDocumentoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  grupodocumento: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_documento: string;
}
