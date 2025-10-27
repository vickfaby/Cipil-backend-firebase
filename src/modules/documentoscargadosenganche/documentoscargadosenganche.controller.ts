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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
  findAll() {
    return this.documentoscargadosengancheService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosengancheService.findOne(id);
  }
  @Get('/placa/:placa')
  findByPlaca(@Param('placa') placa: string) {
    return this.documentoscargadosengancheService.findByPlaca(placa);
  }

  @Get('/vehicle/:vehiculo')
  findGetByVehiculo(@Param('vehiculo', ParseMongoIdPipe) vehiculo: string) {
    return this.documentoscargadosengancheService.findByResumeVehicle(vehiculo);
  }

  @Get('/user/:user_id/:date')
  findByUser(@Param() params: FindUserDocumentoDto) {
    return this.documentoscargadosengancheService.findByUser(params);
  }

  @Patch(':id')
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
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.documentoscargadosengancheService.remove(id);
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
