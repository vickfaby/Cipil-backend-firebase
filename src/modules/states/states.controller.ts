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

import { StatesService } from './states.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { DeleteResult } from 'mongoose';

@ApiTags('geografia')
@ApiBearerAuth('JWT-auth')
@Controller('states')
@UseGuards(FirebaseAuthGuard)
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nuevo estado/departamento',
    description: 'Permite agregar un nuevo estado o departamento al catálogo de ubicaciones geográficas'
  })
  @ApiBody({ 
    type: CreateStateDto,
    description: 'Datos del estado/departamento a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Estado/departamento creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estado creado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Antioquia' },
            codigo: { type: 'string', example: 'ANT' },
            country_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o estado ya existe' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  create(@Body() createStateDto: CreateStateDto) {
    return this.statesService.create(createStateDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los estados/departamentos',
    description: 'Retorna una lista de todos los estados o departamentos disponibles en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de estados/departamentos obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estados obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Antioquia' },
              codigo: { type: 'string', example: 'ANT' },
              country_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
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
    return this.statesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener estado/departamento por ID',
    description: 'Retorna la información de un estado o departamento específico usando su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del estado/departamento',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado/departamento encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estado encontrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Antioquia' },
            codigo: { type: 'string', example: 'ANT' },
            country_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Estado/departamento no encontrado' 
  })
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(id);
  }

  @Get('/country/:id')
  @ApiOperation({ 
    summary: 'Obtener estados/departamentos por país',
    description: 'Retorna todos los estados o departamentos que pertenecen a un país específico'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del país',
    example: '507f1f77bcf86cd799439012',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estados/departamentos del país obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estados del país obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Antioquia' },
              codigo: { type: 'string', example: 'ANT' },
              country_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
              estado: { type: 'boolean', example: true }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'País no encontrado o sin estados/departamentos' 
  })
  findById(@Param('id') id: string) {
    return this.statesService.findById(id);
  }

  @Get('/state/:id')
  @ApiOperation({ 
    summary: 'Buscar estado por ID específico',
    description: 'Retorna la información de un estado usando su ID personalizado'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID personalizado del estado',
    example: '5',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estado encontrado exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              id: { type: 'number', example: 5 },
              name: { type: 'string', example: 'Antioquia' },
              country_id: { type: 'number', example: 1 },
              country_code: { type: 'string', example: 'CO' },
              state_code: { type: 'string', example: 'ANT' }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Estado no encontrado' 
  })
  findBynumber(@Param('id') id: string) {
    return this.statesService.findBynumber(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar estado/departamento',
    description: 'Permite actualizar parcialmente los datos de un estado o departamento existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del estado/departamento',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateStateDto,
    description: 'Datos del estado/departamento a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado/departamento actualizado exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'Estado/departamento no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos' 
  })
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.statesService.update(id, updateStateDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar estado/departamento',
    description: 'Permite eliminar (desactivar) un estado o departamento del catálogo'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del estado/departamento',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado/departamento eliminado exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'Estado/departamento no encontrado' 
  })
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.statesService.remove(id);
  }
}
