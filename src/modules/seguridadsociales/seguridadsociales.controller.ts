import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import type { Multer } from 'multer';
import { existsSync } from 'fs';
import { join } from 'path';

import { SeguridadsocialesService } from './seguridadsociales.service';
import { CreateSeguridadsocialeDto } from './dto/create-seguridadsociale.dto';
import { UpdateSeguridadsocialeDto } from './dto/update-seguridadsociale.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { storage } from 'src/common/utils/media.handle';

@ApiTags('Seguridad Social')
@Controller('seguridadsociales')
export class SeguridadsocialesController {
  constructor(
    private readonly seguridadsocialesService: SeguridadsocialesService,
  ) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('documento', { storage }))
  create(
    @Body() createSeguridadsocialeDto: CreateSeguridadsocialeDto,
    @UploadedFile() file: Multer.File,
  ) {
    if (file) {
      createSeguridadsocialeDto.documento = file.filename;
    }
    return this.seguridadsocialesService.create(createSeguridadsocialeDto);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  findAll() {
    return this.seguridadsocialesService.findAll();
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.seguridadsocialesService.findOne(id);
  }

  @Get('/resume/:resume')
  @UseGuards(FirebaseAuthGuard)
  findByResume(@Param('resume', ParseMongoIdPipe) resume: string) {
    return this.seguridadsocialesService.findByResume(resume);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSeguridadsocialeDto: UpdateSeguridadsocialeDto,
  ) {
    return this.seguridadsocialesService.update(id, updateSeguridadsocialeDto);
  }

  @Patch(':id/imagen')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('documento', { storage }))
  @ApiOperation({ summary: 'Actualizar solo la imagen de un documento de seguridad social' })
  @ApiParam({ name: 'id', description: 'ID del registro de seguridad social' })
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
      throw new BadRequestException(
        'No se ha proporcionado ningún archivo. Debe enviar un archivo usando la key "documento"',
      );
    }
    return this.seguridadsocialesService.updateImagen(id, file.filename);
  }

  @Patch(':id/nombre-imagen')
  @UseGuards(FirebaseAuthGuard)
  updateNombreImagen(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body('documento') documento: string,
  ) {
    return this.seguridadsocialesService.updateImagen(id, documento);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.seguridadsocialesService.remove(id);
  }

  @Post('/upload/file')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('documento', { storage }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      documento: file.filename,
    };
  }

  @Get('/view/:filename')
  viewFile(@Param('filename') filename: string, @Res() res: Response) {
    const logger = new Logger('Seguridadsociales');
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
