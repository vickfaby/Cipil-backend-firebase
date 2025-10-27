import { Body, Controller, Post } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ActiveAuthDto } from './dto/active-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-pass-auth.dto';
//import { CheckAuthDto } from './dto/check-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Permite registrar un nuevo usuario en el sistema con sus datos básicos y rol asignado'
  })
  @ApiBody({ 
    type: RegisterAuthDto,
    description: 'Datos necesarios para el registro del usuario'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario registrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            correo: { type: 'string', example: 'juan@example.com' },
            roles_id: { type: 'string', example: '507f1f77bcf86cd799439012' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'El correo ya está registrado' },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  handleRegister(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Permite a un usuario autenticarse en el sistema usando email y contraseña'
  })
  @ApiBody({ 
    type: LoginAuthDto,
    description: 'Credenciales de acceso del usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Autenticación exitosa',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Autenticación exitosa' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                nombre: { type: 'string', example: 'Juan Pérez' },
                correo: { type: 'string', example: 'juan@example.com' },
                roles_id: { type: 'string', example: '507f1f77bcf86cd799439012' }
              }
            }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Credenciales inválidas',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Credenciales inválidas' },
        statusCode: { type: 'number', example: 401 }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos' 
  })
  handleLogin(@Body() loginDto: LoginAuthDto) {
    return this.authService.loginFirebase(loginDto.correo); 
  }

  // @Get('refresh')
  // handleAuthStatus(@Body() checkAuthDto: CheckAuthDto) {
  //   return this.authService.checkAuthStatus(checkAuthDto);
  // }

  @Post('active')
  @ApiOperation({ 
    summary: 'Activar usuario',
    description: 'Permite activar o desactivar un usuario en el sistema'
  })
  @ApiBody({ 
    type: ActiveAuthDto,
    description: 'Datos para la activación del usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario activado/desactivado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario activado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            correo: { type: 'string', example: 'juan@example.com' },
            estado: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  handleActive(@Body() activeDto: ActiveAuthDto) {
    return this.authService.active(activeDto);
  }

  @Post('changepassword')
  @ApiOperation({ 
    summary: 'Cambiar contraseña',
    description: 'Permite a un usuario cambiar su contraseña proporcionando el email y la nueva contraseña'
  })
  @ApiBody({ 
    type: ChangePasswordAuthDto,
    description: 'Datos para el cambio de contraseña'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contraseña cambiada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Contraseña cambiada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            correo: { type: 'string', example: 'juan@example.com' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o usuario no encontrado' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  handleChangepass(@Body() changePasswordAuthDto: ChangePasswordAuthDto) {
    return this.authService.resetpass(changePasswordAuthDto);
  }
}
