import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'Foto de perfil del usuario',
    example: 'https://example.com/photo.jpg',
    required: false
  })
  foto?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez Actualizado',
    required: false
  })
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'ID del tipo de documento',
    example: '507f1f77bcf86cd799439013',
    required: false
  })
  tipodocumento?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'Fecha de nacimiento',
    example: '1990-05-15',
    required: false
  })
  fecha_nacimiento?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'ID del sexo',
    example: '507f1f77bcf86cd799439014',
    required: false
  })
  sexo?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'juan.nuevo@example.com',
    required: false
  })
  correo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'Hash de la wallet del usuario',
    example: 'abc123def456updated',
    required: false
  })
  hashwallet?: string;
}
