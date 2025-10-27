import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateMarcaenganchesDto {
  @IsOptional()
  @ApiProperty()
  _id: string;

  @IsOptional()
  @ApiProperty()
  __v: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  marcaEnganche: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  modeloEnganche: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  numEjesEnganche: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  numChasisEnganche: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  largoTotalEnganche: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  anchoTotalEnganche: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  altoTotalEnganche: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  pesoTotalEnganche: number;

  @IsOptional()
  @ApiProperty()
  detalleEnganche: string;
}
