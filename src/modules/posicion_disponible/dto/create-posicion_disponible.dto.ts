import { IsNumber, IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreatePosiciondisponibleDto {
  @IsString()
  @IsOptional()
  direccion: string;

  @IsNumber()
  @IsOptional()
  latitud: number;

  @IsNumber()
  @IsOptional()
  longitud: number;

  @IsMongoId()
  @IsOptional()
  resume_id: string;

  @IsMongoId()
  @IsOptional()
  resumevehiculo_id: string;
}

