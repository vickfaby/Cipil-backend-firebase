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

import { ReferenciasService } from './referencias.service';
import { CreateReferenciaDto } from './dto/create-referencia.dto';
import { UpdateReferenciaDto } from './dto/update-referencia.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Referencias')
@Controller('referencias')
@UseGuards(FirebaseAuthGuard)
export class ReferenciasController {
  constructor(private readonly referenciasService: ReferenciasService) {}

  @Post()
  create(@Body() createReferenciaDto: CreateReferenciaDto) {
    return this.referenciasService.create(createReferenciaDto);
  }

  @Get()
  findAll() {
    return this.referenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.referenciasService.findOne(id);
  }

  @Get('/resume/:resume')
  findGetByResume(@Param('resume', ParseMongoIdPipe) resume: string) {
    return this.referenciasService.findByResume(resume);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateReferenciaDto: UpdateReferenciaDto,
  ) {
    return this.referenciasService.update(id, updateReferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.referenciasService.remove(id);
  }
}
