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
import { TipopersonaService } from './tipopersona.service';
import { CreateTipopersonaDto } from './dto/create-tipopersona.dto';
import { UpdateTipopersonaDto } from './dto/update-tipopersona.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('tipopersona')
@UseGuards(FirebaseAuthGuard)
export class TipopersonaController {
  constructor(private readonly tipopersonaService: TipopersonaService) {}

  @Post()
  create(@Body() createTipopersonaDto: CreateTipopersonaDto) {
    return this.tipopersonaService.create(createTipopersonaDto);
  }

  @Get()
  findAll() {
    return this.tipopersonaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipopersonaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateTipopersonaDto: UpdateTipopersonaDto,
  ) {
    return this.tipopersonaService.update(id, updateTipopersonaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.tipopersonaService.remove(id);
  }
}
