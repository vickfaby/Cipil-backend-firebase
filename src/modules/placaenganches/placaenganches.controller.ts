import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlacaenganchesService } from './placaenganches.service';
import { CreatePlacaenganchesDto } from './dto/create-placaenganches.dto';
import { UpdatePlacaenganchesDto } from './dto/update-placaenganches.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/utils/media.handle';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import type { Multer } from 'multer';

@ApiTags('Placa enganches')
@Controller('placaenganches')
@UseGuards(FirebaseAuthGuard)
export class PlacaenganchesController {
  constructor(private readonly placaenganchesService: PlacaenganchesService) {}

  @Post()
  create(@Body() createPlacaenganchesDto: CreatePlacaenganchesDto) {
    return this.placaenganchesService.create(createPlacaenganchesDto);
  }

  @Get()
  findAll() {
    return this.placaenganchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.placaenganchesService.findOne(id);
  }
  @Get('/placa/:placa')
  findByPlaca(@Param('placa') placa: string) {
    return this.placaenganchesService.findByPlaca(placa);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updatePlacaenganchDto: UpdatePlacaenganchesDto,
  ) {
    return this.placaenganchesService.update(id, updatePlacaenganchDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.placaenganchesService.remove(id);
  }

  @Post('/upload/file')
  @UseInterceptors(FileInterceptor('foto', { storage }))
  uploadFile(@UploadedFile() file: Multer.File) {
    return {
      message: 'upload file successfully',
      foto: file.filename,
    };
  }
}
