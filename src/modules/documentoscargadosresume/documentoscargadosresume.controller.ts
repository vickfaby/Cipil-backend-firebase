import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

import { DocumentoscargadosresumeService } from './documentoscargadosresume.service';
import { CreateDocumentoscargadosresumeDto } from './dto/create-documentoscargadosresume.dto';
import { UpdateDocumentoscargadosresumeDto } from './dto/update-documentoscargadosresume.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/media.handle';
import { FindUserDocumentoDto } from './dto/find-userdocumentovencido.dto';
import type { Response } from 'express';
import type { Multer } from 'multer';
import { existsSync } from 'fs';
import { join } from 'path';

@ApiTags('Documentos cargados resume')
@Controller('documentoscargadosresume')
export class DocumentoscargadosresumeController {
  constructor(
    private readonly documentoscargadosresumeService: DocumentoscargadosresumeService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('documento', { storage }))
  create(
    @Body()
    createDocumentoscargadosresumeDto: CreateDocumentoscargadosresumeDto,
    @UploadedFile() file: Multer.File,
  ) {
    createDocumentoscargadosresumeDto.documento = file.filename;
    return this.documentoscargadosresumeService.create(
      createDocumentoscargadosresumeDto,
    );
  }

  @Get()
  findAll() {
    return this.documentoscargadosresumeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosresumeService.findOne(id);
  }

  @Get('/resume/:resume')
  findGetByResume(@Param('resume', ParseMongoIdPipe) resume: string) {
    return this.documentoscargadosresumeService.findByResume(resume);
  }

  @Get('/user/:user_id/:date')
  findByUser(@Param() params: FindUserDocumentoDto) {
    return this.documentoscargadosresumeService.findByUser(params);
  }

  @Get('/userdocuments/:user_id')
  findDocumentsByUser(@Param() params: FindUserDocumentoDto) {
    return this.documentoscargadosresumeService.findDocumentsByUser(params);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body()
    updateDocumentoscargadosresumeDto: UpdateDocumentoscargadosresumeDto,
  ) {
    //updateDocumentoscargadosresumeDto.documento = file.filename;
    return this.documentoscargadosresumeService.update(
      id,
      updateDocumentoscargadosresumeDto,
    );
  }

  @Patch(':id/imagen')
  @UseInterceptors(FileInterceptor('documento', { storage }))
  @ApiOperation({ summary: 'Actualizar solo la imagen de un documento de operador' })
  @ApiParam({ name: 'id', description: 'ID del documento cargado de operador' })
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
    return this.documentoscargadosresumeService.updateImagen(id, file.filename);
  }

  @Patch(':id/nombre-imagen')
  updateNombreImagen(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body('documento') documento: string,
  ) {
    return this.documentoscargadosresumeService.updateImagen(id, documento);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosresumeService.remove(id);
  }

  @Post('/upload/file')
  @UseInterceptors(FileInterceptor('documento', { storage }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      documento: file.filename,
    };
  }

  @Get('/view/:filename')
  viewFile(@Param('filename') filename: string, @Res() res: Response) {
    const logger = new Logger('Documentoscargadosresume');
    // Construir la ruta del archivo
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    // Verificar si el archivo existe
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    // Servir el archivo
    return res.sendFile(filePath);
  }
}
