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

import { AnosvehiculosService } from './anosvehiculos.service';
import { CreateAnosvehiculoDto } from './dto/create-anosvehiculo.dto';
import { UpdateAnosvehiculoDto } from './dto/update-anosvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Años vehiculos')
@Controller('anosvehiculos')
@UseGuards(FirebaseAuthGuard)
export class AnosvehiculosController {
  constructor(private readonly anosvehiculosService: AnosvehiculosService) {}

  @Post()
  create(@Body() createAnosvehiculoDto: CreateAnosvehiculoDto) {
    return this.anosvehiculosService.create(createAnosvehiculoDto);
  }

  @Get()
  
  findAll() {
    return this.anosvehiculosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.anosvehiculosService.findOne(id);
  }
  @Get('/brand/:brand')
  findBrand(@Param('brand', ParseMongoIdPipe) brand: string) {
    return this.anosvehiculosService.findByBrand(brand);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateAnosvehiculoDto: UpdateAnosvehiculoDto,
  ) {
    return this.anosvehiculosService.update(id, updateAnosvehiculoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.anosvehiculosService.remove(id);
  }
}
