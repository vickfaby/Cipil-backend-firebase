import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber } from 'class-validator';

export class CreateAnosvehiculoDto {
  @IsNumber()
  @ApiProperty()
  ano: number;

  @IsMongoId()
  @ApiProperty()
  marcavehiculo_id: string;
}
