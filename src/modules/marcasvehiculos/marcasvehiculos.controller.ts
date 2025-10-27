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

import { MarcasvehiculosService } from './marcasvehiculos.service';
import { CreateMarcasvehiculoDto } from './dto/create-marcasvehiculo.dto';
import { UpdateMarcasvehiculoDto } from './dto/update-marcasvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Marcas vehiculo')
@Controller('marcasvehiculos')
@UseGuards(FirebaseAuthGuard)
export class MarcasvehiculosController {
  constructor(
    private readonly marcasvehiculosService: MarcasvehiculosService,
  ) {}

  @Post()
  create(@Body() createMarcasvehiculoDto: CreateMarcasvehiculoDto) {
    return this.marcasvehiculosService.create(createMarcasvehiculoDto);
  }

  @Get()
  findAll() {
    return this.marcasvehiculosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.marcasvehiculosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateMarcasvehiculoDto: UpdateMarcasvehiculoDto,
  ) {
    return this.marcasvehiculosService.update(id, updateMarcasvehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.marcasvehiculosService.remove(id);
  }
}
