import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { EstadoAuditoriaDocumentosEnganche } from './entities/estado-auditoria-documentosenganche.enum';

import { AuditoriadocumentosengancheService } from './auditoriadocumentosenganche.service';
import { CreateAuditoriadocumentosengancheDto } from './dto/create-auditoriadocumentosenganche.dto';
import { UpdateAuditoriadocumentosengancheDto } from './dto/update-auditoriadocumentosenganche.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@ApiTags('AuditoriaDocumentosEnganche')
@Controller('auditoriadocumentosenganche')
export class AuditoriadocumentosengancheController {
  constructor(private readonly service: AuditoriadocumentosengancheService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de auditoría de documento' })
  @ApiBody({
    description: 'Datos para crear la auditoría',
    examples: {
      ejemplo: {
        summary: 'Crear auditoría NO_AUDITADO por defecto',
        value: {
          resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
          documento_cargado_id: '6710d1c2f2a4b1e2d3c4a5b7',
          auditor: '6710d1c2f2a4b1e2d3c4a5b8',
          mensaje: 'En revisión preliminar',
        },
      },
      conEstado: {
        summary: 'Crear auditoría con estado explícito',
        value: {
          resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
          documento_cargado_id: '6710d1c2f2a4b1e2d3c4a5b7',
          auditor: '6710d1c2f2a4b1e2d3c4a5b8',
          estado: 'PENDIENTE',
          mensaje: 'Documento pendiente por validación',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Auditoría creada',
    schema: {
      example: {
        _id: '6710d1c2f2a4b1e2d3c4a5c0',
        resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
        documento_cargado_id: '6710d1c2f2a4b1e2d3c4a5b7',
        auditor: '6710d1c2f2a4b1e2d3c4a5b8',
        estado: 'NO_AUDITADO',
        mensaje: 'En revisión preliminar',
        status: true,
        createdAt: '2025-10-10T12:00:00.000Z',
        updatedAt: '2025-10-10T12:00:00.000Z',
      },
    },
  })
  create(@Body() dto: CreateAuditoriadocumentosengancheDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar auditorías de documentos' })
  @ApiOkResponse({
    description: 'Listado de auditorías',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una auditoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría', example: '6710d1c2f2a4b1e2d3c4a5c0' })
  @ApiOkResponse({
    description: 'Auditoría encontrada',
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar auditorías por estado' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaDocumentosEnganche, example: 'PENDIENTE' })
  @ApiOkResponse({
    description: 'Listado por estado',
  })
  findByEstado(@Param('estado') estado: EstadoAuditoriaDocumentosEnganche) {
    return this.service.findByEstado(estado);
  }

  @Get('estado/:estado/agrupado')
  @ApiOperation({ summary: 'Listar auditorías por estado agrupadas por hoja de vida' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaDocumentosEnganche, example: 'NO_AUDITADO' })
  @ApiOkResponse({
    description: 'Hojas de vida con sus documentos de auditoría agrupados por estado',
  })
  findByEstadoAgrupado(@Param('estado') estado: EstadoAuditoriaDocumentosEnganche) {
    return this.service.findByEstadoAgrupado(estado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una auditoría' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría', example: '6710d1c2f2a4b1e2d3c4a5c0' })
  @ApiBody({
    description: 'Campos a actualizar',
    examples: {
      aprobar: {
        summary: 'Marcar como ACEPTADO',
        value: { estado: 'ACEPTADO', mensaje: 'Documento validado', verificado: true },
      },
      rechazar: {
        summary: 'Marcar como RECHAZADO',
        value: { estado: 'RECHAZADO', mensaje: 'Documento no cumple', verificado: false },
      },
      pedirResubida: {
        summary: 'Solicitar RESUBIR',
        value: { estado: 'RESUBIR', mensaje: 'Subir documento nuevamente' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Auditoría actualizada',
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateAuditoriadocumentosengancheDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (soft-delete) una auditoría' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría', example: '6710d1c2f2a4b1e2d3c4a5c0' })
  @ApiOkResponse({
    description: 'Resultado de eliminación',
    schema: {
      example: { acknowledged: true, deletedCount: 1 },
    },
  })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.service.remove(id);
  }

  @Get('debug/documento/:documentoId')
  debugDocumento(@Param('documentoId', ParseMongoIdPipe) documentoId: string) {
    return this.service.debugDocumento(documentoId);
  }
}

