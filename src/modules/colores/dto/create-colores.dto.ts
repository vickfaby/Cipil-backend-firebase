import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateColoreDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre_color: string;
  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty()
  detalle_color: string;
}
