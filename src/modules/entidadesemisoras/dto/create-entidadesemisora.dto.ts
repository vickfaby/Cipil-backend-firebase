import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateEntidadesemisorasDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_entidad: string;

  @IsNumber()
  @MinLength(1)
  @ApiProperty()
  telefono_entidad: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  direccion_entidad: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  ciudad_entidad: string;
}
