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

import { EntidadesService } from './entidades.service';
import { CreateEntidadesDto } from './dto/create-entidades.dto';
import { UpdateEntidadesDto } from './dto/update-entidades.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Entidades')
@Controller('entidades')
@UseGuards(FirebaseAuthGuard)
export class EntidadesController {
  constructor(private readonly entidadesService: EntidadesService) {}

  @Post()
  create(@Body() createEntidadeDto: CreateEntidadesDto) {
    return this.entidadesService.create(createEntidadeDto);
  }

  @Get()
  findAll() {
    return this.entidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.entidadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEntidadeDto: UpdateEntidadesDto,
  ) {
    return this.entidadesService.update(id, updateEntidadeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.entidadesService.remove(id);
  }
}
