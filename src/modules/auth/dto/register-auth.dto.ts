import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  nombre: string;

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
}
