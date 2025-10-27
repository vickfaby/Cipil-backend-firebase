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

import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@ApiTags('geografia')
@ApiBearerAuth('JWT-auth')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear nuevo país',
    description: 'Permite agregar un nuevo país al catálogo de ubicaciones geográficas'
  })
  @ApiBody({ 
    type: CreateCountryDto,
    description: 'Datos del país a crear'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'País creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'País creado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Colombia' },
            codigo: { type: 'string', example: 'CO' },
            iso3: { type: 'string', example: 'COL' },
            codigoTelefonico: { type: 'string', example: '+57' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos o país ya existe' 
  })
  @ApiInternalServerErrorResponse({ 
    description: 'Error interno del servidor' 
  })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los países',
    description: 'Retorna una lista de todos los países disponibles en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de países obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Países obtenidos exitosamente' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              nombre: { type: 'string', example: 'Colombia' },
              codigo: { type: 'string', example: 'CO' },
              iso3: { type: 'string', example: 'COL' },
              codigoTelefonico: { type: 'string', example: '+57' },
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
    return this.countriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener país por ID',
    description: 'Retorna la información de un país específico usando su ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del país',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'País encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'País encontrado exitosamente' },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            nombre: { type: 'string', example: 'Colombia' },
            codigo: { type: 'string', example: 'CO' },
            iso3: { type: 'string', example: 'COL' },
            codigoTelefonico: { type: 'string', example: '+57' },
            estado: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'País no encontrado' 
  })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Get('/country/:id')
  @ApiOperation({ 
    summary: 'Buscar país por ID específico',
    description: 'Retorna la información de un país usando una búsqueda específica por ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del país',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'País encontrado exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'País no encontrado' 
  })
  findById(@Param('id') id: string) {
    return this.countriesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar país',
    description: 'Permite actualizar parcialmente los datos de un país existente'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del país',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({ 
    type: UpdateCountryDto,
    description: 'Datos del país a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'País actualizado exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'País no encontrado' 
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos' 
  })
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar país',
    description: 'Permite eliminar (desactivar) un país del catálogo'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID único del país',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'País eliminado exitosamente' 
  })
  @ApiNotFoundResponse({ 
    description: 'País no encontrado' 
  })
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
