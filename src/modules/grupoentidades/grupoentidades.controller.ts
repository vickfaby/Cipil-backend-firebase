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

import { GrupoentidadesService } from './grupoentidades.service';
import { CreateGrupoentidadeDto } from './dto/create-grupoentidade.dto';
import { UpdateGrupoentidadeDto } from './dto/update-grupoentidade.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Grupo Entidades')
@Controller('grupoentidades')
@UseGuards(FirebaseAuthGuard)
export class GrupoentidadesController {
  constructor(private readonly grupoentidadesService: GrupoentidadesService) {}

  @Post()
  create(@Body() createGrupoentidadeDto: CreateGrupoentidadeDto) {
    return this.grupoentidadesService.create(createGrupoentidadeDto);
  }

  @Get()
  findAll() {
    return this.grupoentidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.grupoentidadesService.findOne(id);
  }

  @Get('/entidad/:entidad_id')
  findByEntity(@Param('entidad_id', ParseMongoIdPipe) entidad_id: string) {
    return this.grupoentidadesService.findByEntity(entidad_id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateGrupoentidadeDto: UpdateGrupoentidadeDto,
  ) {
    return this.grupoentidadesService.update(id, updateGrupoentidadeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.grupoentidadesService.remove(id);
  }
}
