import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsEmail({}, { message: 'Este campo debe ser un email valido' })
  @ApiProperty()
  correo: string;

  @IsString({ message: 'La  contraseña debe contener caracteres válidos' })
  @MinLength(6, {
    message: 'La contraseña debe tener más de 6 caracteres o más',
  })
  @MaxLength(12)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'La contraseña debe tener letras mayúsculas, minúsculas y números',
  })
  @ApiProperty()
  password: string;

}
