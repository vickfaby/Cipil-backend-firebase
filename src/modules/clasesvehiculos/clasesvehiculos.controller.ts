import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ClasesvehiculosService } from './clasesvehiculos.service';
import { CreateClasesvehiculoDto } from './dto/create-clasesvehiculo.dto';
import { UpdateClasesvehiculoDto } from './dto/update-clasesvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@ApiTags('Clases vehiculos')
@Controller('clasesvehiculos')
export class ClasesvehiculosController {
  constructor(
    private readonly clasesvehiculosService: ClasesvehiculosService,
  ) {}

  @Post()
  create(@Body() createClasesvehiculoDto: CreateClasesvehiculoDto) {
    return this.clasesvehiculosService.create(createClasesvehiculoDto);
  }

  @Get()
  findAll() {
    return this.clasesvehiculosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.clasesvehiculosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateClasesvehiculoDto: UpdateClasesvehiculoDto,
  ) {
    return this.clasesvehiculosService.update(id, updateClasesvehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.clasesvehiculosService.remove(id);
  }
}
