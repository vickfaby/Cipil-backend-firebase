import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuariosDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  foto: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre: string;

  @IsOptional()
  @ApiProperty()
  tipodocumento: string;

  @IsOptional()
  @ApiProperty()
  numerodocumento: number;

  @IsOptional()
  @ApiProperty()
  fecha_nacimiento: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  sexo: string;

  @IsString()
  @IsEmail({}, { message: 'Este campo debe ser un email valido' })
  @ApiProperty()
  correo: string;

  @IsString({ message: 'La  contraseña debe contener caracteres válidos' })
  @MinLength(6)
  @MaxLength(12)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener letras mayúsculas, minúsculas y números',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  token: string;

  @IsString()
  @ApiProperty()
  roles_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  hashwallet: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+57 3001234567',
    required: false,
  })
  telefono: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Calificación del usuario',
    example: '5.0',
    required: false,
  })
  calificacion: string;
}
