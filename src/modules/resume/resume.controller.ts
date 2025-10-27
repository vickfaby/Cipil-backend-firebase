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
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { storage } from 'src/common/utils/media.handle';

import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { GetResumePDFDto } from './dto/get-resume-pdf.dto';
import { PaginateV2 } from 'src/common/decorators/paginate-v2.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import type { Multer } from 'multer';

@ApiTags('Resume')
@Controller('resume')
@UseGuards(FirebaseAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.create(createResumeDto);
  }

  @Get()
  findAll(@PaginateV2() pagination: any) {
    return this.resumeService.findAll(pagination);
  }

  @Get('/by-not-user/:user_id')
  findAllNotByUser(
    @Param('user_id', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumeService.findAllNotByUser(userId, pagination);
  }

  @Get('/by-not-user/:user_id/search')
  findAllNotByUserSearch(
    @Param('user_id', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
    @Query('text') text: string,
  ) {
    return this.resumeService.findAllNotByUserWithSearch(
      userId,
      text,
      pagination,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumeService.findOne(id);
  }

  @Get(':id/with-audits')
  findOneWithAudits(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumeService.findOneWithLatestAudits(id);
  }

  @Get('/documento/:documento')
  findByDocumento(@Param('documento') documento: string) {
    return this.resumeService.findByDocument(documento);
  }

  @Get('/by-empresa/:usuarioEmpresaId')
  findByUsuarioEmpresa(
    @Param('usuarioEmpresaId', ParseMongoIdPipe) usuarioEmpresaId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumeService.findByUsuarioEmpresa(usuarioEmpresaId, pagination);
  }

  @Get('/by-empresa/:usuarioEmpresaId/search')
  findByUsuarioEmpresaSearch(
    @Param('usuarioEmpresaId', ParseMongoIdPipe) usuarioEmpresaId: string,
    @PaginateV2() pagination: any,
    @Query('text') text: string,
  ) {
    return this.resumeService.findByUsuarioEmpresaWithSearch(
      usuarioEmpresaId,
      text,
      pagination,
    );
  }

  @Get('/by-operador/:usuarioOperadorId')
  findByUsuarioOperador(
    @Param('usuarioOperadorId', ParseMongoIdPipe) usuarioOperadorId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumeService.findByUsuarioOperador(usuarioOperadorId, pagination);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.update(id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumeService.remove(id);
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

  @Get('pdf/:typedoc/:numdoc/:typepdf/:typehead')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=pdf.pdf')
  async generatePDF(
    @Param() { typedoc, numdoc, typepdf, typehead }: GetResumePDFDto,
  ): Promise<StreamableFile> {
    const pdfData = await this.resumeService.generatePDFFile({
      typedoc: typedoc,
      numdoc: numdoc,
      typepdf: typepdf,
      typehead: typehead,
    });
    return new StreamableFile(new Uint8Array(pdfData));
  }
}
