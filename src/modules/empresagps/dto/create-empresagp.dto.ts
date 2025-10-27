import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateEmpresagpDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_empresa: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  direccion: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  telefono: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  pagina_acceso: string;
}
