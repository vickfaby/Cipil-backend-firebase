import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { EstadoAuditoriaDocOperador } from './entities/estado-auditoria.enum';

import { AuditoriadocsoperadorService } from './auditoriadocsoperador.service';
import { CreateAuditoriadocsoperadorDto } from './dto/create-auditoriadocsoperador.dto';
import { UpdateAuditoriadocsoperadorDto } from './dto/update-auditoriadocsoperador.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@ApiTags('AuditoriaDocsOperador')
@Controller('auditoriadocsoperador')
export class AuditoriadocsoperadorController {
  constructor(private readonly service: AuditoriadocsoperadorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de auditoría de documento de operador' })
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
          mensaje: 'Documento pendiente por validación de nitidez',
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
  create(@Body() dto: CreateAuditoriadocsoperadorDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar auditorías de documentos de operador' })
  @ApiOkResponse({
    description: 'Listado de auditorías',
    schema: {
      example: [
        {
          _id: '6710d1c2f2a4b1e2d3c4a5c0',
          resume_id: {
            _id: '6710d1c2f2a4b1e2d3c4a5b6',
            nombre: 'Juan',
            apellido: 'Pérez',
            razonsocial: null,
          },
          documento_cargado_id: {
            _id: '6710d1c2f2a4b1e2d3c4a5b7',
            nombre: 'Cédula',
            documento: '1756905851750.jpg',
            estado_documento: 0,
          },
          auditor: { _id: '6710d1c2f2a4b1e2d3c4a5b8', nombre: 'Auditor 1', correo: 'auditor@demo.com' },
          estado: 'PENDIENTE',
          mensaje: 'Documento pendiente por validación de nitidez',
          status: true,
          createdAt: '2025-10-10T12:00:00.000Z',
          updatedAt: '2025-10-10T12:05:00.000Z',
        },
      ],
    },
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una auditoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la auditoría', example: '6710d1c2f2a4b1e2d3c4a5c0' })
  @ApiOkResponse({
    description: 'Auditoría encontrada',
    schema: {
      example: {
        _id: '6710d1c2f2a4b1e2d3c4a5c0',
        resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
        documento_cargado_id: '6710d1c2f2a4b1e2d3c4a5b7',
        auditor: '6710d1c2f2a4b1e2d3c4a5b8',
        estado: 'ACEPTADO',
        mensaje: 'Se aprueba el documento, cumple con requisitos.',
        status: true,
        createdAt: '2025-10-10T12:00:00.000Z',
        updatedAt: '2025-10-10T12:10:00.000Z',
      },
    },
  })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.service.findOne(id);
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Listar auditorías por estado' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaDocOperador, example: 'PENDIENTE' })
  @ApiOkResponse({
    description: 'Listado por estado',
    schema: {
      example: [
        {
          _id: '6710d1c2f2a4b1e2d3c4a5c0',
          estado: 'PENDIENTE',
          documento_cargado_id: {
            _id: '6710d1c2f2a4b1e2d3c4a5b7',
            nombre: 'Cédula',
            documento: '1756905851750.jpg',
            estado_documento: 0,
            resume_id: {
              _id: '6710d1c2f2a4b1e2d3c4a5b6',
              nombre: 'Juan',
              apellido: 'Pérez',
              razonsocial: null,
            },
          },
          auditor: { _id: '6710d1c2f2a4b1e2d3c4a5b8', nombre: 'Auditor 1', correo: 'auditor@demo.com' },
          status: true,
          createdAt: '2025-10-10T12:00:00.000Z',
          updatedAt: '2025-10-10T12:05:00.000Z',
        },
      ],
    },
  })
  findByEstado(@Param('estado') estado: EstadoAuditoriaDocOperador) {
    return this.service.findByEstado(estado);
  }

  @Get('estado/:estado/agrupado')
  @ApiOperation({ summary: 'Listar auditorías por estado agrupadas por hoja de vida' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaDocOperador, example: 'NO_AUDITADO' })
  @ApiOkResponse({
    description: 'Hojas de vida con sus documentos de auditoría agrupados por estado',
    schema: {
      example: [
        {
          _id: '66881cf42d553ea64ac337d3',
          nombre: 'Jane',
          apellido: 'Doe',
          razonsocial: '',
          numerodocumento: 123456789,
          telefono: 3001234567,
          direccion: 'Calle 123 #45-67',
          fecha_nacimiento: '1990-05-15T00:00:00.000Z',
          ubicacion: 'Bogotá',
          foto: 'foto123.jpg',
          tipodocumento: '63563961b254e1de4342fd5e',
          sexo: '6396885d7a73d14b9e9378e9',
          documentos_auditoria: [
            {
              _id: '68e99009a7e86be1a3c43332',
              documento_cargado_id: {
                _id: '65a35e842d41e9f4f917d31d',
                nombre: 'camara de comercio',
                documento: '1705205164924.jpg',
                categoria: 'adasd',
                codigo_referencia: 'asdas',
                estado_documento: 1,
                fecha_expedicion: '2023-12-13T05:00:00.000Z',
                fecha_vencimiento: '2024-07-20T07:00:00.000Z',
                url: '1705205164924.jpg',
                resume_id: {
                  _id: '66881cf42d553ea64ac337d3',
                  nombre: 'Jane',
                  apellido: 'Doe',
                  razonsocial: '',
                },
              },
              auditor: {
                _id: '65085c4d1d7a88d66d938be7',
                nombre: 'Carlos andres rodriguez',
                correo: 'carlosaudiovisual2015@gmail.com',
              },
              estado: 'NO_AUDITADO',
              mensaje: 'En revisión preliminar',
              status: true,
              createdAt: '2025-10-10T23:00:25.326Z',
              updatedAt: '2025-10-10T23:00:25.326Z',
            },
            {
              _id: '68e91ffdca854ad545d5b9e2',
              documento_cargado_id: {
                _id: '65a35e842d41e9f4f917d31e',
                nombre: 'RUT',
                documento: '1705205164925.jpg',
                estado_documento: 1,
                url: '1705205164925.jpg',
              },
              auditor: {
                _id: '65085c4d1d7a88d66d938be7',
                nombre: 'Carlos andres rodriguez',
                correo: 'carlosaudiovisual2015@gmail.com',
              },
              estado: 'NO_AUDITADO',
              mensaje: 'En revisión preliminar',
              status: true,
              createdAt: '2025-10-10T15:02:21.356Z',
              updatedAt: '2025-10-10T15:02:21.356Z',
            },
          ],
        },
      ],
    },
  })
  findByEstadoAgrupado(@Param('estado') estado: EstadoAuditoriaDocOperador) {
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
        value: { estado: 'ACEPTADO', mensaje: 'Correcto y legible' },
      },
      rechazar: {
        summary: 'Marcar como RECHAZADO',
        value: { estado: 'RECHAZADO', mensaje: 'Documento ilegible' },
      },
      pedirResubida: {
        summary: 'Solicitar RESUBIR',
        value: { estado: 'RESUBIR', mensaje: 'Subir nuevamente con buena iluminación' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Auditoría actualizada',
    schema: {
      example: {
        _id: '6710d1c2f2a4b1e2d3c4a5c0',
        estado: 'ACEPTADO',
        mensaje: 'Correcto y legible',
        updatedAt: '2025-10-10T12:12:00.000Z',
      },
    },
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateAuditoriadocsoperadorDto,
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


