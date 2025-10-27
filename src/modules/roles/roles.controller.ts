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
  ApiBearerAuth
} from '@nestjs/swagger';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
@UseGuards(FirebaseAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nuevo rol',
    description: 'Permite crear un nuevo rol con permisos específicos en el sistema'
  })
  @ApiBody({ 
    type: CreateRoleDto,
    description: 'Datos del rol a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Rol creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Rol creado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Administrador' },
            descripcion: { type: 'string', example: 'Rol con acceso completo al sistema' },
            permisos: { type: 'array', items: { type: 'string' }, example: ['create', 'read', 'update', 'delete'] },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o rol ya existe' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los roles',
    description: 'Retorna una lista de todos los roles disponibles en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de roles obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Roles obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Administrador' },
              descripcion: { type: 'string', example: 'Rol con acceso completo al sistema' },
              permisos: { type: 'array', items: { type: 'string' }, example: ['create', 'read', 'update', 'delete'] },
              estado: { type: 'boolean', example: true }
            }
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener rol por ID',
    description: 'Retorna la información completa de un rol específico usando su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del rol (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Rol encontrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Administrador' },
            descripcion: { type: 'string', example: 'Rol con acceso completo al sistema' },
            permisos: { type: 'array', items: { type: 'string' }, example: ['create', 'read', 'update', 'delete'] },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Rol no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID inválido' 
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar rol',
    description: 'Permite actualizar parcialmente los datos de un rol existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del rol (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateRoleDto,
    description: 'Datos del rol a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Rol actualizado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Administrador Actualizado' },
            descripcion: { type: 'string', example: 'Descripción actualizada del rol' },
            permisos: { type: 'array', items: { type: 'string' }, example: ['create', 'read', 'update'] },
            estado: { type: 'boolean', example: true },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Rol no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o ID inválido' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar rol',
    description: 'Permite eliminar (desactivar) un rol del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del rol (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Rol eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Rol eliminado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Administrador' },
            estado: { type: 'boolean', example: false },
            deletedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Rol no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID inválido' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
