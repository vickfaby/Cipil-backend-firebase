import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { AuditoriadocsvehiculoService } from './auditoriadocsvehiculo.service';
import { CreateAuditoriadocsvehiculoDto } from './dto/create-auditoriadocsvehiculo.dto';
import { UpdateAuditoriadocsvehiculoDto } from './dto/update-auditoriadocsvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { EstadoAuditoriaDocVehiculo } from './entities/estado-auditoria-vehiculo.enum';
import { FindByFechaDto } from './dto/find-by-fecha.dto';

@ApiTags('AuditoriaDocsVehiculo')
@Controller('auditoriadocsvehiculo')
export class AuditoriadocsvehiculoController {
  constructor(private readonly service: AuditoriadocsvehiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de auditoría de documento de vehículo' })
  @ApiBody({
    description: 'Datos para crear la auditoría',
    examples: {
      ejemplo: {
        summary: 'Crear auditoría NO_AUDITADO por defecto',
        value: {
          resumevehiculo_id: '6710d1c2f2a4b1e2d3c4a5b6',
          documento_cargado_id: '6710d1c2f2a4b1e2d3c4a5b7',
          auditor: '6710d1c2f2a4b1e2d3c4a5b8',
          mensaje: 'En revisión preliminar',
        },
      },
      conEstado: {
        summary: 'Crear auditoría con estado explícito',
        value: {
          resumevehiculo_id: '6710d1c2f2a4b1e2d3c4a5b6',
          documento_cargado_id: '6710d1c2f2a4b1e2d3c4a5b7',
          auditor: '6710d1c2f2a4b1e2d3c4a5b8',
          estado: 'PENDIENTE',
          mensaje: 'Documento pendiente por validación de nitidez',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Auditoría creada' })
  create(@Body() dto: CreateAuditoriadocsvehiculoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar auditorías de documentos de vehículo' })
  @ApiOkResponse({ description: 'Listado de auditorías' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una auditoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría' })
  @ApiOkResponse({ description: 'Auditoría encontrada' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar auditorías por estado' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaDocVehiculo })
  @ApiOkResponse({ description: 'Listado por estado' })
  findByEstado(@Param('estado') estado: EstadoAuditoriaDocVehiculo) {
    return this.service.findByEstado(estado);
  }

  @Get('estado/:estado/agrupado')
  @ApiOperation({ summary: 'Listar auditorías por estado agrupadas por hoja de vida del vehículo' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaDocVehiculo })
  @ApiOkResponse({ description: 'Hojas de vida de vehículo con auditorías agrupadas' })
  findByEstadoAgrupado(@Param('estado') estado: EstadoAuditoriaDocVehiculo) {
    return this.service.findByEstadoAgrupado(estado);
  }

  @Get('vehiculo/:resumevehiculoId')
  @ApiOperation({ summary: 'Listar auditorías por vehículo' })
  @ApiParam({ name: 'resumevehiculoId', description: 'ID de Resumevehiculo', example: '6710d1c2f2a4b1e2d3c4a5b6' })
  @ApiOkResponse({
    description: 'Listado por vehículo',
    schema: {
      example: [
        {
          _id: '6710d1c2f2a4b1e2d3c4a5c0',
          resumevehiculo_id: { _id: '671...', placa: 'ABC123', modelo: 'FH' },
          documento_cargado_id: { _id: '672...', nombre: 'SOAT', documento: '1760708390981.jpg', estado_documento: 1, url: '1760708390981.jpg' },
          auditor: { _id: '673...', nombre: 'Auditor 1', correo: 'auditor@demo.com' },
          estado: 'PENDIENTE',
          mensaje: 'Validación en proceso',
          status: true,
          createdAt: '2025-10-10T12:00:00.000Z',
          updatedAt: '2025-10-10T12:05:00.000Z',
        },
      ],
    },
  })
  findByVehiculo(@Param('resumevehiculoId', ParseMongoIdPipe) resumevehiculoId: string) {
    return this.service.findByVehiculo(resumevehiculoId);
  }

  @Get('documento/:documentoId')
  @ApiOperation({ summary: 'Listar auditorías por documento cargado de vehículo' })
  @ApiParam({ name: 'documentoId', description: 'ID de Documentoscargadosvehiculo', example: '6710d1c2f2a4b1e2d3c4a5b7' })
  @ApiOkResponse({ description: 'Listado por documento' })
  findByDocumento(@Param('documentoId', ParseMongoIdPipe) documentoId: string) {
    return this.service.findByDocumento(documentoId);
  }

  @Get('auditor/:auditorId')
  @ApiOperation({ summary: 'Listar auditorías por auditor' })
  @ApiParam({ name: 'auditorId', description: 'ID del usuario auditor', example: '6710d1c2f2a4b1e2d3c4a5b8' })
  @ApiOkResponse({ description: 'Listado por auditor' })
  findByAuditor(@Param('auditorId', ParseMongoIdPipe) auditorId: string) {
    return this.service.findByAuditor(auditorId);
  }

  @Get('placa/:placa')
  @ApiOperation({ summary: 'Listar auditorías por placa de vehículo' })
  @ApiParam({ name: 'placa', description: 'Placa del vehículo', example: 'ABC123' })
  @ApiOkResponse({ description: 'Listado por placa' })
  findByPlaca(@Param('placa') placa: string) {
    return this.service.findByPlaca(placa);
  }

  @Post('rango-fechas')
  @ApiOperation({ summary: 'Listar auditorías por rango de fechas (updatedAt)' })
  @ApiBody({ description: 'Rango de fechas en ISO 8601', schema: { example: { from: '2025-01-01T00:00:00.000Z', to: '2025-12-31T23:59:59.999Z' } } })
  @ApiOkResponse({ description: 'Listado por rango de fechas' })
  findByRangoFechas(@Body() body: FindByFechaDto) {
    return this.service.findByRangoFechas(body.from, body.to);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una auditoría' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría' })
  @ApiOkResponse({ description: 'Auditoría actualizada' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateAuditoriadocsvehiculoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (soft-delete) una auditoría' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría' })
  @ApiOkResponse({ description: 'Resultado de eliminación' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.service.remove(id);
  }

  @Get('debug/documento/:documentoId')
  debugDocumento(@Param('documentoId', ParseMongoIdPipe) documentoId: string) {
    return this.service.debugDocumento(documentoId);
  }
}



