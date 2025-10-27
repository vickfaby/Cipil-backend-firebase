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

import { TipocarroceriasService } from './tipocarrocerias.service';
import { CreateTipocarroceriaDto } from './dto/create-tipocarroceria.dto';
import { UpdateTipocarroceriaDto } from './dto/update-tipocarroceria.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Tipo carrocerias')
@Controller('tipocarrocerias')
@UseGuards(FirebaseAuthGuard)
export class TipocarroceriasController {
  constructor(
    private readonly tipocarroceriasService: TipocarroceriasService,
  ) {}

  @Post()
  create(@Body() createTipocarroceriaDto: CreateTipocarroceriaDto) {
    return this.tipocarroceriasService.create(createTipocarroceriaDto);
  }

  @Get()
  findAll() {
    return this.tipocarroceriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipocarroceriasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTipocarroceriaDto: UpdateTipocarroceriaDto,
  ) {
    return this.tipocarroceriasService.update(id, updateTipocarroceriaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipocarroceriasService.remove(id);
  }
}
