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
import { ApiTags } from '@nestjs/swagger';

import { GrupodocumentosService } from './grupodocumentos.service';
import { CreateGrupodocumentoDto } from './dto/create-grupodocumento.dto';
import { UpdateGrupodocumentoDto } from './dto/update-grupodocumento.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Grupo Documentos')
@Controller('grupodocumentos')
@UseGuards(FirebaseAuthGuard)
export class GrupodocumentosController {
  constructor(
    private readonly grupodocumentosService: GrupodocumentosService,
  ) {}

  @Post()
  create(@Body() createGrupodocumentoDto: CreateGrupodocumentoDto) {
    return this.grupodocumentosService.create(createGrupodocumentoDto);
  }

  @Get()
  findAll() {
    return this.grupodocumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.grupodocumentosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateGrupodocumentoDto: UpdateGrupodocumentoDto,
  ) {
    return this.grupodocumentosService.update(id, updateGrupodocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.grupodocumentosService.remove(id);
  }
}
