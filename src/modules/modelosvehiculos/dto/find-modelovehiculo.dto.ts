import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindModelovehiculoDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  marca_vehiculo_ano_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  marca_vehiculo_id: string;
}
