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

import { SeguridadsocialesService } from './seguridadsociales.service';
import { CreateSeguridadsocialeDto } from './dto/create-seguridadsociale.dto';
import { UpdateSeguridadsocialeDto } from './dto/update-seguridadsociale.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Seguridad Social')
@Controller('seguridadsociales')
@UseGuards(FirebaseAuthGuard)
export class SeguridadsocialesController {
  constructor(
    private readonly seguridadsocialesService: SeguridadsocialesService,
  ) {}

  @Post()
  create(@Body() createSeguridadsocialeDto: CreateSeguridadsocialeDto) {
    return this.seguridadsocialesService.create(createSeguridadsocialeDto);
  }

  @Get()
  findAll() {
    return this.seguridadsocialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.seguridadsocialesService.findOne(id);
  }

  @Get('/resume/:resume')
  findByResume(@Param('resume', ParseMongoIdPipe) resume: string) {
    return this.seguridadsocialesService.findByResume(resume);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSeguridadsocialeDto: UpdateSeguridadsocialeDto,
  ) {
    return this.seguridadsocialesService.update(id, updateSeguridadsocialeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.seguridadsocialesService.remove(id);
  }
}
