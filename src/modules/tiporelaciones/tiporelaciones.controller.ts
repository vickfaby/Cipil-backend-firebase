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

import { TiporelacionesService } from './tiporelaciones.service';
import { CreateTiporelacionesDto } from './dto/create-tiporelaciones.dto';
import { UpdateTiporelacionesDto } from './dto/update-tiporelaciones.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Tipo relaciones')
@Controller('tiporelaciones')
@UseGuards(FirebaseAuthGuard)
export class TiporelacionesController {
  constructor(private readonly tiporelacionesService: TiporelacionesService) {}

  @Post()
  create(@Body() createTiporelacioneDto: CreateTiporelacionesDto) {
    return this.tiporelacionesService.create(createTiporelacioneDto);
  }

  @Get()
  findAll() {
    return this.tiporelacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tiporelacionesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTiporelacionesDto: UpdateTiporelacionesDto,
  ) {
    return this.tiporelacionesService.update(id, updateTiporelacionesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tiporelacionesService.remove(id);
  }
}
