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
  Header,
  StreamableFile,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { storage } from 'src/common/utils/media.handle';

import { ResumevehiculoService } from './resumevehiculo.service';
import { CreateResumevehiculoDto } from './dto/create-resumevehiculo.dto';
import { UpdateResumevehiculoDto } from './dto/update-resumevehiculo.dto';
import { GetResumeVehiculoPDFDto } from './dto/get-resume-pdf.dto';
import { PaginateV2 } from 'src/common/decorators/paginate-v2.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import type { Multer } from 'multer';

@ApiTags('Resume vehiculo')
@Controller('resumevehiculo')
@UseGuards(FirebaseAuthGuard)
export class ResumevehiculoController {
  constructor(private readonly resumevehiculoService: ResumevehiculoService) {}

  @Post()
  create(@Body() createResumevehiculoDto: CreateResumevehiculoDto) {
    return this.resumevehiculoService.create(createResumevehiculoDto);
  }

  @Get()
  findAll(@PaginateV2() pagination: any) {
    return this.resumevehiculoService.findAll(pagination);
  }

  @Get('/by-not-user/:user_id')
  findAllNotByUser(
    @Param('user_id', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumevehiculoService.findAllNotByUser(userId, pagination);
  }

  @Get('/by-not-user/:user_id/search')
  findAllNotByUserSearch(
    @Param('user_id', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
    @Query('text') text: string,
  ) {
    return this.resumevehiculoService.findAllNotByUserWithSearch(
      userId,
      text,
      pagination,
    );
  }

  @Get('/usuario/:userId')
  findByUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumevehiculoService.findByUser(userId, pagination);
  }

  @Get('/usuario/:userId/search')
  findByUserSearch(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
    @Query('text') text: string,
  ) {
    return this.resumevehiculoService.findByUserWithSearch(
      userId,
      text,
      pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumevehiculoService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateResumevehiculoDto: UpdateResumevehiculoDto,
  ) {
    console.log('=== PATCH /resumevehiculo/:id ===');
    console.log('ID:', id);
    console.log('Documentos vehiculo recibidos:', updateResumevehiculoDto.documentosvehiculo?.length || 0);
    
    const result = await this.resumevehiculoService.update(id, updateResumevehiculoDto);
    
    console.log('Resultado del update:', result ? 'OK' : 'NULL/UNDEFINED');
    if (result && result.documentosvehiculo) {
      console.log('Documentos en la respuesta:', result.documentosvehiculo.length);
    }
    
    return result;
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumevehiculoService.remove(id);
  }

  @Post('/upload/file')
  @UseInterceptors(FileInterceptor('foto', { storage }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      foto: file.filename,
    };
  }

  @Get('/upload/file/:filename')
  @Header('Content-Type', 'image/jpeg')
  @ApiOperation({ summary: 'Obtener/visualizar imagen subida (foto de vehículo o documento)' })
  @ApiParam({ name: 'filename', description: 'Nombre del archivo', example: '1761117297698.jpg' })
  getUploadedImage(@Param('filename') filename: string): StreamableFile {
    // Validación básica del nombre de archivo para evitar path traversal
    const isValidName = /^[A-Za-z0-9_.-]+$/.test(filename);
    if (!isValidName) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const fileStats = statSync(filePath);
    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream, {
      type: 'image/jpeg',
      disposition: 'inline',
      length: fileStats.size,
    });
  }

  @Get('pdf/:numdoc/:typepdf/:typehead')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=pdf.pdf')
  async getPDF(
    @Param() { numdoc, typepdf, typehead }: GetResumeVehiculoPDFDto,
  ): Promise<StreamableFile> {
    //const pdfBuffer = await generatePDF(getResumeVehiculoDto);
    //return new StreamableFile(pdfBuffer);
    const pdfData = await this.resumevehiculoService.generatePDFFile({
      numdoc: numdoc,
      typepdf: typepdf,
      typehead: typehead,
    });
    return new StreamableFile(new Uint8Array(pdfData));
  }
}
