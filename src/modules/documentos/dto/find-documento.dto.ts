import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindDocumentoDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  grupodocumento: string;
}
