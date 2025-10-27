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
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { ApiTags } from '@nestjs/swagger';

import { MarcaenganchesService } from './marcaenganches.service';
import { CreateMarcaenganchesDto } from './dto/create-marcaenganches.dto';
import { UpdateMarcaenganchesDto } from './dto/update-marcaenganches.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Marca enganches')
@Controller('marcaenganches')
@UseGuards(FirebaseAuthGuard)
export class MarcaenganchesController {
  constructor(private readonly marcaenganchesService: MarcaenganchesService) {}

  @Post()
  create(@Body() createMargaenganchDto: CreateMarcaenganchesDto) {
    //console.log(createMargaenganchDto);
    return this.marcaenganchesService.create(createMargaenganchDto);
  }

  @Get()
  findAll() {
    return this.marcaenganchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.marcaenganchesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateMargaenganchDto: UpdateMarcaenganchesDto,
  ) {
    return this.marcaenganchesService.update(id, updateMargaenganchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.marcaenganchesService.remove(id);
  }
}
