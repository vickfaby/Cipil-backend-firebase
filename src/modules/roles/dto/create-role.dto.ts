import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre: string;
}
