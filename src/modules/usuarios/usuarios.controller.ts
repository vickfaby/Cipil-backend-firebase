import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UsuariosService } from './usuarios.service';
import { CreateUsuariosDto } from './dto/create-usuarios.dto';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@ApiTags('usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
@UseGuards(FirebaseAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description:
      'Permite crear un nuevo usuario en el sistema con todos sus datos personales y de acceso',
  })
  @ApiBody({
    type: CreateUsuariosDto,
    description: 'Datos completos del usuario a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario creado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            correo: { type: 'string', example: 'juan@example.com' },
            numerodocumento: { type: 'number', example: 12345678 },
            roles_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o correo ya registrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  create(@Body() createUsuariosDto: CreateUsuariosDto) {
    return this.usuariosService.create(createUsuariosDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Retorna una lista de todos los usuarios registrados en el sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuarios obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Juan Pérez' },
              correo: { type: 'string', example: 'juan@example.com' },
              numerodocumento: { type: 'number', example: 12345678 },
              roles_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
              estado: { type: 'boolean', example: true },
              createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('debug/:id')
  debugUsuario(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usuariosService.debugUsuario(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description:
      'Retorna la información completa de un usuario específico usando su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario encontrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            foto: { type: 'string', example: 'https://example.com/photo.jpg' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            tipodocumento: {
              type: 'string',
              example: '507f1f77bcf86cd799439013',
            },
            numerodocumento: { type: 'number', example: 12345678 },
            fecha_nacimiento: { type: 'string', example: '1990-05-15' },
            sexo: { type: 'string', example: '507f1f77bcf86cd799439014' },
            correo: { type: 'string', example: 'juan@example.com' },
            roles_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            hashwallet: { type: 'string', example: 'abc123def456' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Usuario no encontrado' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description:
      'Permite actualizar parcialmente los datos de un usuario existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  @ApiBody({
    type: UpdateUsuariosDto,
    description: 'Datos del usuario a actualizar (campos opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Usuario actualizado exitosamente',
        },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Juan Pérez Actualizado' },
            correo: { type: 'string', example: 'juan.nuevo@example.com' },
            numerodocumento: { type: 'number', example: 12345678 },
            roles_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o ID inválido',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUsuariosDto: UpdateUsuariosDto,
  ) {
    return this.usuariosService.update(id, updateUsuariosDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Permite eliminar (desactivar) un usuario del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Usuario eliminado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            correo: { type: 'string', example: 'juan@example.com' },
            estado: { type: 'boolean', example: false },
            deletedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'ID inválido',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.usuariosService.remove(id);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Obtener perfil del usuario actual',
    description:
      'Retorna la información completa del perfil del usuario actualmente autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Perfil obtenido exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            foto: { type: 'string', example: 'https://example.com/photo.jpg' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            tipodocumento: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                nombre: { type: 'string', example: 'Cédula de Ciudadanía' },
              },
            },
            numerodocumento: { type: 'number', example: 12345678 },
            fecha_nacimiento: { type: 'string', example: '1990-05-15' },
            sexo: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
                nombre: { type: 'string', example: 'Masculino' },
              },
            },
            correo: { type: 'string', example: 'juan@example.com' },
            roles_id: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
                nombre: { type: 'string', example: 'Usuario' },
              },
            },
            hashwallet: { type: 'string', example: 'abc123def456' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o no proporcionado',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Token inválido o expirado' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usuariosService.findProfile(user.id);
    return {
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: profile,
    };
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Actualizar perfil del usuario actual',
    description:
      'Permite al usuario autenticado actualizar su información de perfil',
  })
  @ApiBody({
    type: UpdateProfileDto,
    description:
      'Datos del perfil a actualizar (todos los campos son opcionales)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Perfil actualizado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            foto: {
              type: 'string',
              example: 'https://example.com/new-photo.jpg',
            },
            nombre: { type: 'string', example: 'Juan Pérez Actualizado' },
            tipodocumento: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                nombre: { type: 'string', example: 'Cédula de Ciudadanía' },
              },
            },
            numerodocumento: { type: 'number', example: 12345678 },
            fecha_nacimiento: { type: 'string', example: '1990-05-15' },
            sexo: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439014' },
                nombre: { type: 'string', example: 'Masculino' },
              },
            },
            correo: { type: 'string', example: 'juan.nuevo@example.com' },
            roles_id: {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
                nombre: { type: 'string', example: 'Usuario' },
              },
            },
            hashwallet: { type: 'string', example: 'abc123def456updated' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T11:45:00Z' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o no proporcionado',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
  })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedProfile = await this.usuariosService.updateProfile(
      user.id,
      updateProfileDto,
    );
    return {
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedProfile,
    };
  }
}
