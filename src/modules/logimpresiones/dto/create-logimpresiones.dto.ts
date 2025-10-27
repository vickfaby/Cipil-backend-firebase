import { IsOptional } from 'class-validator';

export class CreateLogimpresionesDto {
  @IsOptional()
  _id: string;
  @IsOptional()
  __v: string;

  @IsOptional()
  fecha_impresion: Date;

  @IsOptional()
  resume_id: string;

  @IsOptional()
  resumevehiculo_id: string;
}
