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

import { TipovehiculosService } from './tipovehiculos.service';
import { CreateTipovehiculosDto } from './dto/create-tipovehiculos.dto';
import { UpdateTipovehiculosDto } from './dto/update-tipovehiculos.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Tipo vehiculos')
@Controller('tipovehiculos')
@UseGuards(FirebaseAuthGuard)
export class TipovehiculosController {
  constructor(private readonly tipovehiculosService: TipovehiculosService) {}

  @Post()
  create(@Body() createTipovehiculosDto: CreateTipovehiculosDto) {
    return this.tipovehiculosService.create(createTipovehiculosDto);
  }

  @Get()
  findAll() {
    return this.tipovehiculosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipovehiculosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTipovehiculosDto: UpdateTipovehiculosDto,
  ) {
    return this.tipovehiculosService.update(id, updateTipovehiculosDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipovehiculosService.remove(id);
  }
}
