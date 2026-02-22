import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { DocumentoscargadosengancheService } from './documentoscargadosenganche.service';
import { CreateDocumentoscargadosengancheDto } from './dto/create-documentoscargadosenganche.dto';
import { UpdateDocumentoscargadosengancheDto } from './dto/update-documentoscargadosenganche.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/media.handle';
import { FindUserDocumentoDto } from './dto/find-userdocumentovencido.dto';
import type { Multer } from 'multer';

@ApiTags('Documentos cargados enganche')
@Controller('documentoscargadosenganche')
export class DocumentoscargadosengancheController {
  constructor(
    private readonly documentoscargadosengancheService: DocumentoscargadosengancheService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('documento', { storage }))
  @ApiOperation({ summary: 'Crear un documento cargado de enganche' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del documento y archivo. Incluir todos los campos del DTO más el archivo en el campo "documento"',
    schema: {
      type: 'object',
      required: ['documento', 'grupodocumento_id', 'documento_id', 'fecha_expedicion', 'fecha_vencimiento', 'nombre', 'categoria', 'codigo_referencia', 'observaciones', 'entidad_emisora', 'placa_enganche', 'user_id', 'estado_documento'],
      properties: {
        documento: {
          type: 'string',
          format: 'binary',
          description: 'Archivo del documento (PDF, imagen, etc.)',
        },
        grupodocumento_id: { type: 'string', description: 'ID del grupo de documento' },
        documento_id: { type: 'string', description: 'ID del documento' },
        fecha_expedicion: { type: 'string', description: 'Fecha de expedición' },
        fecha_vencimiento: { type: 'string', description: 'Fecha de vencimiento' },
        nombre: { type: 'string', description: 'Nombre del documento' },
        categoria: { type: 'string', description: 'Categoría' },
        codigo_referencia: { type: 'string', description: 'Código de referencia' },
        observaciones: { type: 'string', description: 'Observaciones' },
        entidad_emisora: { type: 'string', description: 'Entidad emisora' },
        placa_enganche: { type: 'string', description: 'Placa del enganche' },
        user_id: { type: 'string', description: 'ID del usuario' },
        estado_documento: { type: 'number', description: 'Estado del documento' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Documento creado exitosamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o archivo no proporcionado' })
  create(
    @Body()
    createDocumentoscargadosengancheDto: CreateDocumentoscargadosengancheDto,
    @UploadedFile() file: Multer.File,
  ) {
    createDocumentoscargadosengancheDto.documento = file.filename;
    return this.documentoscargadosengancheService.create(
      createDocumentoscargadosengancheDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los documentos cargados de enganche' })
  @ApiResponse({ status: 200, description: 'Lista de documentos cargados' })
  findAll() {
    return this.documentoscargadosengancheService.findAll();
  }

  @Get('/placa/:placa')
  @ApiOperation({ summary: 'Buscar documentos por placa del enganche' })
  @ApiParam({ name: 'placa', description: 'Placa del enganche', example: 'ABC123' })
  @ApiResponse({ status: 200, description: 'Documentos encontrados para la placa' })
  @ApiNotFoundResponse({ description: 'No se encontraron documentos para la placa' })
  findByPlaca(@Param('placa') placa: string) {
    return this.documentoscargadosengancheService.findByPlaca(placa);
  }

  @Get('/vehicle/:vehiculo')
  @ApiOperation({ summary: 'Buscar documentos por ID de vehículo (resume)' })
  @ApiParam({ name: 'vehiculo', description: 'ID del vehículo (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Documentos del vehículo' })
  @ApiNotFoundResponse({ description: 'Vehículo no encontrado' })
  @ApiBadRequestResponse({ description: 'ID de vehículo inválido' })
  findGetByVehiculo(@Param('vehiculo', ParseMongoIdPipe) vehiculo: string) {
    return this.documentoscargadosengancheService.findByResumeVehicle(vehiculo);
  }

  @Get('/user/:user_id/:date')
  @ApiOperation({ summary: 'Buscar documentos de un usuario por fecha' })
  @ApiParam({ name: 'user_id', description: 'ID del usuario' })
  @ApiParam({ name: 'date', description: 'Fecha de consulta' })
  @ApiResponse({ status: 200, description: 'Documentos del usuario para la fecha indicada' })
  findByUser(@Param() params: FindUserDocumentoDto) {
    return this.documentoscargadosengancheService.findByUser(params);
  }

  @Get('upload/file/:filename')
  @ApiOperation({ summary: 'Obtener imagen/archivo de un documento de enganche' })
  @ApiParam({ name: 'filename', description: 'Nombre del archivo (ej. 1771791819606.jpg)', example: '1771791819606.jpg' })
  getUploadedFile(@Param('filename') filename: string): StreamableFile {
    const isValidName = /^[A-Za-z0-9_.-]+$/.test(filename);
    if (!isValidName) {
      throw new NotFoundException('Archivo no encontrado');
    }
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }
    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream, {
      type: 'image/jpeg',
      disposition: 'inline',
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  @ApiNotFoundResponse({ description: 'Documento no encontrado' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosengancheService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un documento cargado de enganche' })
  @ApiParam({ name: 'id', description: 'ID del documento (MongoDB ObjectId)' })
  @ApiBody({ type: UpdateDocumentoscargadosengancheDto })
  @ApiResponse({ status: 200, description: 'Documento actualizado exitosamente' })
  @ApiNotFoundResponse({ description: 'Documento no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos o ID inválido' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body()
    updateDocumentoscargadosengancheDto: UpdateDocumentoscargadosengancheDto,
  ) {
    return this.documentoscargadosengancheService.update(
      id,
      updateDocumentoscargadosengancheDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un documento cargado de enganche' })
  @ApiParam({ name: 'id', description: 'ID del documento (MongoDB ObjectId)' })
  @ApiResponse({ status: 200, description: 'Documento eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Documento no encontrado' })
  @ApiBadRequestResponse({ description: 'ID inválido' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosengancheService.remove(id);
  }

  @Post('/upload/file')
  @UseInterceptors(FileInterceptor('documento', { storage }))
  @ApiOperation({ summary: 'Subir un archivo de documento (solo almacenamiento)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['documento'],
      properties: {
        documento: {
          type: 'string',
          format: 'binary',
          description: 'Archivo del documento a subir',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente' })
  @ApiBadRequestResponse({ description: 'No se proporcionó archivo' })
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      documento: file.filename,
    };
  }
}
