import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSexoDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_sexo: string;
}
