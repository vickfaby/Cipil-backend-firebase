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
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ReferenciasService } from './referencias.service';
import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Referencias')
@ApiBearerAuth()
@Controller('referencias')
@UseGuards(FirebaseAuthGuard)
export class ReferenciasController {
  constructor(private readonly referenciasService: ReferenciasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una referencia' })
  @ApiBody({
    description: 'Datos para crear una referencia',
    type: CreateReferenciaDto,
    examples: {
      ejemplo: {
        summary: 'Referencia personal',
        value: {
          nombre_completo: 'Carlos Gomez',
          telefonos: 3001234567,
          pais_referencia: 1,
          estado_referencia: 11,
          ciudad_referencia: 11001,
          direccion: 'Calle 10 #20-30',
          relacion: '6710d1c2f2a4b1e2d3c4a5b7',
          resume_id: '6710d1c2f2a4b1e2d3c4a5b6',
          user_id: '6710d1c2f2a4b1e2d3c4a5b8',
          status: true,
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Referencia creada correctamente' })
  create(@Body() createReferenciaDto: CreateReferenciaDto) {
    return this.referenciasService.create(createReferenciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las referencias' })
  @ApiOkResponse({
    description:
      'Listado de referencias con el objeto de la última auditoría en `ultima_auditoria`',
  })
  findAll() {
    return this.referenciasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una referencia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la referencia',
    example: '6710d1c2f2a4b1e2d3c4a5b6',
  })
  @ApiOkResponse({ description: 'Referencia encontrada' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.referenciasService.findOne(id);
  }

  @Get('/resume/:resume')
  @ApiOperation({ summary: 'Listar referencias por hoja de vida' })
  @ApiParam({
    name: 'resume',
    description: 'ID de la hoja de vida (resume)',
    example: '6710d1c2f2a4b1e2d3c4a5b6',
  })
  @ApiOkResponse({ description: 'Listado de referencias del resume' })
  findGetByResume(@Param('resume', ParseMongoIdPipe) resume: string) {
    return this.referenciasService.findByResume(resume);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una referencia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la referencia a actualizar',
    example: '6710d1c2f2a4b1e2d3c4a5b6',
  })
  @ApiBody({
    description: 'Campos de referencia a actualizar',
    type: UpdateReferenciaDto,
  })
  @ApiOkResponse({ description: 'Referencia actualizada correctamente' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateReferenciaDto: UpdateReferenciaDto,
  ) {
    return this.referenciasService.update(id, updateReferenciaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar (soft delete) una referencia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la referencia a eliminar',
    example: '6710d1c2f2a4b1e2d3c4a5b6',
  })
  @ApiOkResponse({ description: 'Resultado de eliminación' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.referenciasService.remove(id);
  }
}
