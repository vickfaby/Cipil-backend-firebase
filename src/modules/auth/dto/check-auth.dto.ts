import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckAuthDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  _id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  token: string;
}
