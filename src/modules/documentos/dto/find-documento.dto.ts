import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindDocumentoDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  grupodocumento: string;
  grupodocumento_id: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  nombre_documento: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  descripcion_documento: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  tipo_documento: string;
}
