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

import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('geografia')
@ApiBearerAuth('JWT-auth')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva ciudad',
    description: 'Permite agregar una nueva ciudad al catálogo de ubicaciones geográficas'
  })
  @ApiBody({ 
    type: CreateCityDto,
    description: 'Datos de la ciudad a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Ciudad creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ciudad creada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Medellín' },
            codigo: { type: 'string', example: 'MED' },
            state_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            codigoPostal: { type: 'string', example: '050001' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o ciudad ya existe' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las ciudades',
    description: 'Retorna una lista de todas las ciudades disponibles en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de ciudades obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ciudades obtenidas exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Medellín' },
              codigo: { type: 'string', example: 'MED' },
              state_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
              codigoPostal: { type: 'string', example: '050001' },
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
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener ciudad por ID',
    description: 'Retorna la información de una ciudad específica usando su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la ciudad',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ciudad encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ciudad encontrada exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Medellín' },
            codigo: { type: 'string', example: 'MED' },
            state_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            codigoPostal: { type: 'string', example: '050001' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Ciudad no encontrada' 
  })
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Get('/state/:id')
  @ApiOperation({ 
    summary: 'Obtener ciudades por estado/departamento',
    description: 'Retorna todas las ciudades que pertenecen a un estado o departamento específico'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID del estado/departamento',
    example: '507f1f77bcf86cd799439012',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ciudades del estado/departamento obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ciudades del estado obtenidas exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Medellín' },
              codigo: { type: 'string', example: 'MED' },
              state_id: { type: 'string', example: '507f1f77bcf86cd799439012' },
              codigoPostal: { type: 'string', example: '050001' },
              estado: { type: 'boolean', example: true }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Estado/departamento no encontrado o sin ciudades' 
  })
  findById(@Param('id') id: string) {
    return this.citiesService.findById(id);
  }

  @Get('/city/:id')
  @ApiOperation({ 
    summary: 'Buscar ciudad por ID específico',
    description: 'Retorna la información de una ciudad usando su ID personalizado'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID personalizado de la ciudad',
    example: '150',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ciudad encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Ciudad encontrada exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              id: { type: 'number', example: 150 },
              name: { type: 'string', example: 'Medellín' },
              state_id: { type: 'number', example: 5 },
              state_code: { type: 'string', example: 'ANT' },
              country_id: { type: 'number', example: 1 },
              country_code: { type: 'string', example: 'CO' }
            }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Ciudad no encontrada' 
  })
  findBynumber(@Param('id') id: string) {
    return this.citiesService.findBynumber(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar ciudad',
    description: 'Permite actualizar parcialmente los datos de una ciudad existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la ciudad',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateCityDto,
    description: 'Datos de la ciudad a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ciudad actualizada exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'Ciudad no encontrada' 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos' 
  })
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar ciudad',
    description: 'Permite eliminar (desactivar) una ciudad del catálogo'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único de la ciudad',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ciudad eliminada exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'Ciudad no encontrada' 
  })
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id);
  }
}
