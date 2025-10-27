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

import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@ApiTags('catalogos')
@ApiBearerAuth('JWT-auth')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva categoría',
    description: 'Permite agregar una nueva categoría al catálogo del sistema'
  })
  @ApiBody({ 
    type: CreateCategoriaDto,
    description: 'Datos de la categoría a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Categoría creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Categoría creada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Vehículos de Carga' },
            descripcion: { type: 'string', example: 'Categoría para vehículos destinados al transporte de carga' },
            codigo: { type: 'string', example: 'CAT001' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o categoría ya existe' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las categorías',
    description: 'Retorna una lista de todas las categorías disponibles en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de categorías obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Categorías obtenidas exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Vehículos de Carga' },
              descripcion: { type: 'string', example: 'Categoría para vehículos destinados al transporte de carga' },
              codigo: { type: 'string', example: 'CAT001' },
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
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener categoría por ID',
    description: 'Retorna la información de una categoría específica usando su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la categoría (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoría encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Categoría encontrada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Vehículos de Carga' },
            descripcion: { type: 'string', example: 'Categoría para vehículos destinados al transporte de carga' },
            codigo: { type: 'string', example: 'CAT001' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Categoría no encontrada' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID inválido' 
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoriasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar categoría',
    description: 'Permite actualizar parcialmente los datos de una categoría existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la categoría (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateCategoriaDto,
    description: 'Datos de la categoría a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoría actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Categoría actualizada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Vehículos de Carga Pesada' },
            descripcion: { type: 'string', example: 'Categoría actualizada para vehículos de carga pesada' },
            codigo: { type: 'string', example: 'CAT001' },
            estado: { type: 'boolean', example: true },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Categoría no encontrada' 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o ID inválido' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar categoría',
    description: 'Permite eliminar (desactivar) una categoría del catálogo'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la categoría (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Categoría eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Categoría eliminada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Vehículos de Carga' },
            estado: { type: 'boolean', example: false },
            deletedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Categoría no encontrada' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID inválido' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.categoriasService.remove(id);
  }
}
