import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { EstadoAuditoriaReferencia } from './entities/estado-auditoria-referencia.enum';

import { AuditoriareferenciasService } from './auditoriareferencias.service';
import { CreateAuditoriareferenciasDto } from './dto/create-auditoriareferencias.dto';
import { UpdateAuditoriareferenciasDto } from './dto/update-auditoriareferencias.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@ApiTags('AuditoriaReferencias')
@Controller('auditoriareferencias')
export class AuditoriareferenciasController {
  constructor(private readonly service: AuditoriareferenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear registro de auditoría de referencia' })
  @ApiBody({
    description: 'Datos para crear la auditoría',
    examples: {
      ejemplo: {
        summary: 'Crear auditoría NO_AUDITADO por defecto',
        value: {
          resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
          referencia_id: '6710d1c2f2a4b1e2d3c4a5b7',
          auditor: '6710d1c2f2a4b1e2d3c4a5b8',
          mensaje: 'En revisión preliminar',
        },
      },
      conEstado: {
        summary: 'Crear auditoría con estado explícito',
        value: {
          resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
          referencia_id: '6710d1c2f2a4b1e2d3c4a5b7',
          auditor: '6710d1c2f2a4b1e2d3c4a5b8',
          estado: 'PENDIENTE',
          mensaje: 'Referencia pendiente por validación',
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
        referencia_id: '6710d1c2f2a4b1e2d3c4a5b7',
        auditor: '6710d1c2f2a4b1e2d3c4a5b8',
        estado: 'NO_AUDITADO',
        mensaje: 'En revisión preliminar',
        status: true,
        createdAt: '2025-10-10T12:00:00.000Z',
        updatedAt: '2025-10-10T12:00:00.000Z',
      },
    },
  })
  create(@Body() dto: CreateAuditoriareferenciasDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar auditorías de referencias' })
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
          referencia_id: {
            _id: '6710d1c2f2a4b1e2d3c4a5b7',
            nombre_completo: 'Carlos Gómez',
            telefonos: 3001234567,
          },
          auditor: { _id: '6710d1c2f2a4b1e2d3c4a5b8', nombre: 'Auditor 1', correo: 'auditor@demo.com' },
          estado: 'PENDIENTE',
          mensaje: 'Referencia pendiente por validación',
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
        referencia_id: '6710d1c2f2a4b1e2d3c4a5b7',
        auditor: '6710d1c2f2a4b1e2d3c4a5b8',
        estado: 'ACEPTADO',
        mensaje: 'Referencia válida y verificable.',
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
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaReferencia, example: 'PENDIENTE' })
  @ApiOkResponse({
    description: 'Listado por estado',
    schema: {
      example: [
        {
          _id: '6710d1c2f2a4b1e2d3c4a5c0',
          estado: 'PENDIENTE',
          referencia_id: {
            _id: '6710d1c2f2a4b1e2d3c4a5b7',
            nombre_completo: 'Carlos Gómez',
            telefonos: 3001234567,
          },
          auditor: { _id: '6710d1c2f2a4b1e2d3c4a5b8', nombre: 'Auditor 1', correo: 'auditor@demo.com' },
          status: true,
          createdAt: '2025-10-10T12:00:00.000Z',
          updatedAt: '2025-10-10T12:05:00.000Z',
        },
      ],
    },
  })
  findByEstado(@Param('estado') estado: EstadoAuditoriaReferencia) {
    return this.service.findByEstado(estado);
  }

  @Get('estado/:estado/agrupado')
  @ApiOperation({ summary: 'Listar auditorías por estado agrupadas por hoja de vida' })
  @ApiParam({ name: 'estado', enum: EstadoAuditoriaReferencia, example: 'NO_AUDITADO' })
  @ApiOkResponse({
    description: 'Hojas de vida con sus referencias de auditoría agrupadas por estado',
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
          referencias_auditoria: [
            {
              _id: '68e99009a7e86be1a3c43332',
              referencia_id: {
                _id: '65a35e842d41e9f4f917d31d',
                nombre_completo: 'Carlos Gómez',
                telefonos: 3001234567,
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
          ],
        },
      ],
    },
  })
  findByEstadoAgrupado(@Param('estado') estado: EstadoAuditoriaReferencia) {
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
        value: { estado: 'ACEPTADO', mensaje: 'Referencia validada', verificado: true },
      },
      rechazar: {
        summary: 'Marcar como RECHAZADO',
        value: { estado: 'RECHAZADO', mensaje: 'No coincide la información', verificado: false },
      },
      pedirResubida: {
        summary: 'Solicitar RESUBIR',
        value: { estado: 'RESUBIR', mensaje: 'Actualizar datos de contacto' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Auditoría actualizada',
    schema: {
      example: {
        _id: '6710d1c2f2a4b1e2d3c4a5c0',
        estado: 'ACEPTADO',
        mensaje: 'Referencia validada',
        verificado: true,
        updatedAt: '2025-10-10T12:12:00.000Z',
      },
    },
  })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateAuditoriareferenciasDto,
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

  @Get('debug/referencia/:referenciaId')
  debugReferencia(@Param('referenciaId', ParseMongoIdPipe) referenciaId: string) {
    return this.service.debugReferencia(referenciaId);
  }
}

