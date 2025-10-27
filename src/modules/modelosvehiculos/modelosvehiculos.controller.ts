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

import { ModelosvehiculosService } from './modelosvehiculos.service';
import { CreateModelosvehiculoDto } from './dto/create-modelosvehiculo.dto';
import { UpdateModelosvehiculoDto } from './dto/update-modelosvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FindModelovehiculoDto } from './dto/find-modelovehiculo.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Modelos vehiculos')
@Controller('modelosvehiculos')
@UseGuards(FirebaseAuthGuard)
export class ModelosvehiculosController {
  constructor(
    private readonly modelosvehiculosService: ModelosvehiculosService,
  ) {}

  @Post()
  create(@Body() createModelosvehiculoDto: CreateModelosvehiculoDto) {
    return this.modelosvehiculosService.create(createModelosvehiculoDto);
  }

  @Get()
  findAll() {
    return this.modelosvehiculosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.modelosvehiculosService.findOne(id);
  }

  @Get('/:marca_vehiculo_id/:marca_vehiculo_ano_id')
  findYearAndBrand(@Param() params: FindModelovehiculoDto) {
    return this.modelosvehiculosService.findByYearAndBrand(params);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateModelosvehiculoDto: UpdateModelosvehiculoDto,
  ) {
    return this.modelosvehiculosService.update(id, updateModelosvehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.modelosvehiculosService.remove(id);
  }
}
