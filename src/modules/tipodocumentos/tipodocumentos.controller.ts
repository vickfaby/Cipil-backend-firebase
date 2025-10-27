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
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { TipodocumentosService } from './tipodocumentos.service';
import { CreateTipodocumentosDto } from './dto/create-tipodocumentos.dto';
import { UpdateTipodocumentosDto } from './dto/update-tipodocumentos.dto';

@Controller('tipodocumentos')
@UseGuards(FirebaseAuthGuard)
export class TipodocumentosController {
  constructor(private readonly tipodocumentosService: TipodocumentosService) {}

  @Post()
  create(@Body() createTipodocumentoDto: CreateTipodocumentosDto) {
    return this.tipodocumentosService.create(createTipodocumentoDto);
  }

  @Get()
  findAll() {
    return this.tipodocumentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipodocumentosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipodocumentoDto: UpdateTipodocumentosDto,
  ) {
    return this.tipodocumentosService.update(id, updateTipodocumentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipodocumentosService.remove(id);
  }
}
