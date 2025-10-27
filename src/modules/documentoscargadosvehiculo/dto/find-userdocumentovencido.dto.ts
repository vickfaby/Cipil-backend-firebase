import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindUserDocumentoDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  user_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  date: string;
}
