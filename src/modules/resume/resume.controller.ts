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
  Res,
  StreamableFile,
  NotFoundException,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { storageFile } from 'src/common/utils/media.handle';

import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { GetResumePDFDto } from './dto/get-resume-pdf.dto';
import { PaginateV2 } from 'src/common/decorators/paginate-v2.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import type { Multer } from 'multer';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(@Body() createResumeDto: CreateResumeDto) {
    return this.resumeService.create(createResumeDto);
  }

  @Put(':id/disponible')
  @UseGuards(FirebaseAuthGuard)
  @ApiOperation({ summary: 'Actualizar la disponibilidad de un Resume' })
  @ApiParam({ name: 'id', description: 'ID del resume' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        disponible: {
          type: 'boolean',
          description: 'Nuevo estado de disponibilidad',
        },
      },
      required: ['disponible'],
    },
  })
  setDisponible(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body('disponible') disponible: boolean,
  ) {
    return this.resumeService.setDisponible(id, disponible);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  findAll(@PaginateV2() pagination: any) {
    return this.resumeService.findAll(pagination);
  }

  @Get('/by-not-user/:user_id')
  @UseGuards(FirebaseAuthGuard)
  findAllNotByUser(
    @Param('user_id', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumeService.findAllNotByUser(userId, pagination);
  }

  @Get('/by-not-user/:user_id/search')
  @UseGuards(FirebaseAuthGuard)
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
  @UseGuards(FirebaseAuthGuard)
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumeService.findOne(id);
  }

  @Get(':id/with-audits')
  @UseGuards(FirebaseAuthGuard)
  findOneWithAudits(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumeService.findOneWithLatestAudits(id);
  }

  @Get('/check-document/:tipodocumento/:numerodocumento')
  @UseGuards(FirebaseAuthGuard)
  checkDocumentDuplicate(
    @Param('tipodocumento') tipodocumento: string,
    @Param('numerodocumento') numerodocumento: string,
  ) {
    return this.resumeService.checkDocumentDuplicate(tipodocumento, Number(numerodocumento));
  }

  @Get('/documento/:documento')
  @UseGuards(FirebaseAuthGuard)
  findByDocumento(@Param('documento') documento: string) {
    return this.resumeService.findByDocument(documento);
  }

  @Get('/by-empresa/:usuarioEmpresaId')
  @UseGuards(FirebaseAuthGuard)
  findByUsuarioEmpresa(
    @Param('usuarioEmpresaId', ParseMongoIdPipe) usuarioEmpresaId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumeService.findByUsuarioEmpresa(usuarioEmpresaId, pagination);
  }

  @Get('/by-empresa/:usuarioEmpresaId/search')
  @UseGuards(FirebaseAuthGuard)
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
  @UseGuards(FirebaseAuthGuard)
  findByUsuarioOperador(
    @Param('usuarioOperadorId', ParseMongoIdPipe) usuarioOperadorId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.resumeService.findByUsuarioOperador(usuarioOperadorId, pagination);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumeService.update(id, updateResumeDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.resumeService.remove(id);
  }

  @Post('/upload/file')
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('foto', { storage: storageFile }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      foto: file.filename,
    };
  }

  @Get('/upload/file/:filename')
  getUploadedFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): void {
    const isValidName = /^[A-Za-z0-9_.-]+$/.test(filename);
    if (!isValidName) {
      throw new NotFoundException('Archivo no encontrado');
    }

    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    res.sendFile(filePath);
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
