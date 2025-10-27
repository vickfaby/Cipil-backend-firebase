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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentoscargadosvehiculoService } from './documentoscargadosvehiculo.service';
import { CreateDocumentoscargadosvehiculoDto } from './dto/create-documentoscargadosvehiculo.dto';
import { UpdateDocumentoscargadosvehiculoDto } from './dto/update-documentoscargadosvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { storage } from 'src/common/utils/media.handle';
import { FindUserDocumentoDto } from './dto/find-userdocumentovencido.dto';
import type { Multer } from 'multer';

@ApiTags('Documentos cargados vehiculo')
@Controller('documentoscargadosvehiculo')
export class DocumentoscargadosvehiculoController {
  constructor(
    private readonly documentoscargadosvehiculoService: DocumentoscargadosvehiculoService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('documento', { storage }))
  create(
    @Body()
    createDocumentoscargadosvehiculoDto: CreateDocumentoscargadosvehiculoDto,
    @UploadedFile() file: Multer.File,
  ) {
    createDocumentoscargadosvehiculoDto.documento = file.filename;
    return this.documentoscargadosvehiculoService.create(
      createDocumentoscargadosvehiculoDto,
    );
  }

  @Get()
  findAll() {
    return this.documentoscargadosvehiculoService.findAll();
  }

  @Get('/vehicle/:vehiculo')
  findGetByVehiculo(@Param('vehiculo', ParseMongoIdPipe) vehiculo: string) {
    return this.documentoscargadosvehiculoService.findByResumeVehicle(vehiculo);
  }

  @Get('/user/:user_id/:date')
  findByUser(@Param() params: FindUserDocumentoDto) {
    return this.documentoscargadosvehiculoService.findByUser(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosvehiculoService.findOne(id);
  }

  @Patch(':id/imagen')
  @UseInterceptors(FileInterceptor('documento', { storage }))
  @ApiOperation({ summary: 'Actualizar imagen de documento de vehículo subiendo archivo directo' })
  @ApiParam({ name: 'id', description: 'ID del documento cargado de vehículo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen del documento',
    schema: {
      type: 'object',
      properties: {
        documento: {
          type: 'string',
          format: 'binary',
          description: 'Archivo de imagen (JPG, PNG, etc.)',
        },
      },
    },
  })
  updateImagen(
    @Param('id', ParseMongoIdPipe) id: string,
    @UploadedFile() file: Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo. Debe enviar un archivo usando la key "documento"');
    }
    return this.documentoscargadosvehiculoService.updateImagen(id, file.filename);
  }

  @Patch(':id/nombre-imagen')
  @ApiOperation({ summary: 'Actualizar imagen de documento de vehículo usando nombre de archivo' })
  @ApiParam({ name: 'id', description: 'ID del documento cargado de vehículo' })
  @ApiBody({
    description: 'Nombre del archivo previamente subido',
    schema: {
      type: 'object',
      properties: {
        documento: {
          type: 'string',
          example: '1761115902287.jpg',
          description: 'Nombre del archivo obtenido de /upload/file',
        },
      },
    },
  })
  updateNombreImagen(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body('documento') documento: string,
  ) {
    return this.documentoscargadosvehiculoService.updateImagen(id, documento);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body()
    updateDocumentoscargadosvehiculoDto: UpdateDocumentoscargadosvehiculoDto,
  ) {
    return this.documentoscargadosvehiculoService.update(
      id,
      updateDocumentoscargadosvehiculoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosvehiculoService.remove(id);
  }

  @Post('/upload/file')
  @UseInterceptors(FileInterceptor('documento', { storage }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      documento: file.filename,
    };
  }
}
