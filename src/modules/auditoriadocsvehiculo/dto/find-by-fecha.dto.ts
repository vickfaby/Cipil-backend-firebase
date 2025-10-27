import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindByFechaDto {
  @IsDateString()
  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  from: string;

  @IsDateString()
  @ApiProperty({ example: '2025-12-31T23:59:59.999Z' })
  to: string;
}


