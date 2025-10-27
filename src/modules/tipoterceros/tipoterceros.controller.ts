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

import { TipotercerosService } from './tipoterceros.service';
import { CreateTipoterceroDto } from './dto/create-tipotercero.dto';
import { UpdateTipoterceroDto } from './dto/update-tipotercero.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Tipo terceros')
@Controller('tipoterceros')
@UseGuards(FirebaseAuthGuard)
export class TipotercerosController {
  constructor(private readonly tipotercerosService: TipotercerosService) {}

  @Post()
  create(@Body() createTipoterceroDto: CreateTipoterceroDto) {
    return this.tipotercerosService.create(createTipoterceroDto);
  }

  @Get()
  findAll() {
    return this.tipotercerosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipotercerosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTipoterceroDto: UpdateTipoterceroDto,
  ) {
    return this.tipotercerosService.update(id, updateTipoterceroDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipotercerosService.remove(id);
  }
}
