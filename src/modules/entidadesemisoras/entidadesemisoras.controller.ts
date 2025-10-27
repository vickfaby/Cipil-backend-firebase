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

import { EntidadesemisorasService } from './entidadesemisoras.service';
import { CreateEntidadesemisorasDto } from './dto/create-entidadesemisora.dto';
import { UpdateEntidadesemisorasDto } from './dto/update-entidadesemisora.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Entidades Emisoras')
@Controller('entidadesemisoras')
@UseGuards(FirebaseAuthGuard)
export class EntidadesemisorasController {
  constructor(
    private readonly entidadesemisorasService: EntidadesemisorasService,
  ) {}

  @Post()
  create(@Body() createEntidadesemisoraDto: CreateEntidadesemisorasDto) {
    return this.entidadesemisorasService.create(createEntidadesemisoraDto);
  }

  @Get()
  findAll() {
    return this.entidadesemisorasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.entidadesemisorasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEntidadesemisoraDto: UpdateEntidadesemisorasDto,
  ) {
    return this.entidadesemisorasService.update(id, updateEntidadesemisoraDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.entidadesemisorasService.remove(id);
  }
}
