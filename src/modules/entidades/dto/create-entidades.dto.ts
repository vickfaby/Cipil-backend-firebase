import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateEntidadesDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  entidad: string;
}
