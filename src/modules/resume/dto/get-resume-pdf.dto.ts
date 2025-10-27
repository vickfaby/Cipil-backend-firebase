import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetResumePDFDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  typedoc: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  numdoc: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  typepdf: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  typehead: string;
}
