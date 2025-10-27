import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

import { ColoresService } from './colores.service';
import { CreateColoreDto } from './dto/create-colores.dto';
import { UpdateColoreDto } from './dto/update-colores.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@ApiTags('catalogos')
@ApiBearerAuth('JWT-auth')
@Controller('colores')
export class ColoresController {
  constructor(private readonly coloresService: ColoresService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nuevo color',
    description: 'Permite agregar un nuevo color al catálogo de colores para vehículos'
  })
  @ApiBody({ 
    type: CreateColoreDto,
    description: 'Datos del color a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Color creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Color creado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Rojo' },
            codigo: { type: 'string', example: '#FF0000' },
            codigoHexa: { type: 'string', example: 'FF0000' },
            descripcion: { type: 'string', example: 'Color rojo brillante' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o color ya existe' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  create(@Body() createColoreDto: CreateColoreDto) {
    return this.coloresService.create(createColoreDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los colores',
    description: 'Retorna una lista de todos los colores disponibles en el catálogo'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de colores obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Colores obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Rojo' },
              codigo: { type: 'string', example: '#FF0000' },
              codigoHexa: { type: 'string', example: 'FF0000' },
              descripcion: { type: 'string', example: 'Color rojo brillante' },
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
    return this.coloresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener color por ID',
    description: 'Retorna la información de un color específico usando su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del color (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Color encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Color encontrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Rojo' },
            codigo: { type: 'string', example: '#FF0000' },
            codigoHexa: { type: 'string', example: 'FF0000' },
            descripcion: { type: 'string', example: 'Color rojo brillante' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Color no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID inválido' 
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.coloresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar color',
    description: 'Permite actualizar parcialmente los datos de un color existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del color (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateColoreDto,
    description: 'Datos del color a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Color actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Color actualizado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Rojo Carmesí' },
            codigo: { type: 'string', example: '#DC143C' },
            codigoHexa: { type: 'string', example: 'DC143C' },
            descripcion: { type: 'string', example: 'Color rojo carmesí intenso' },
            estado: { type: 'boolean', example: true },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Color no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o ID inválido' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateColoreDto: UpdateColoreDto,
  ) {
    return this.coloresService.update(id, updateColoreDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar color',
    description: 'Permite eliminar (desactivar) un color del catálogo'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del color (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Color eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Color eliminado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Rojo' },
            estado: { type: 'boolean', example: false },
            deletedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Color no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID inválido' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.coloresService.remove(id);
  }
}
