import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateAnosvehiculoDto {
  @IsNumber()
  @MinLength(1)
  @ApiProperty()
  ano: number;

  @IsMongoId()
  @ApiProperty()
  marcavehiculo_id: string;
}
