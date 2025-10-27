import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePlacaenganchesDto {
  @IsNumber()
  @ApiProperty()
  capacidad: number;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  color_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  configuracionvehicular: string;

  @IsString()
  @ApiProperty()
  foto: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  marca_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  modelo: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  numero_serie: string;

  @IsNumber()
  @ApiProperty()
  peso: number;

  @IsString()
  @ApiProperty()
  placa: string;

  @IsString()
  @ApiProperty()
  propietario_id: string;

  @IsString()
  @ApiProperty()
  tenedor_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  tipocarroceria_id: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  user_id: string;
}
