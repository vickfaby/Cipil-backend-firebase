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

import { EmpresagpsService } from './empresagps.service';
import { CreateEmpresagpDto } from './dto/create-empresagp.dto';
import { UpdateEmpresagpDto } from './dto/update-empresagp.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Empresa gps')
@Controller('empresagps')
@UseGuards(FirebaseAuthGuard)
export class EmpresagpsController {
  constructor(private readonly empresagpsService: EmpresagpsService) {}

  @Post()
  create(@Body() createEmpresagpDto: CreateEmpresagpDto) {
    return this.empresagpsService.create(createEmpresagpDto);
  }

  @Get()
  findAll() {
    return this.empresagpsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.empresagpsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateEmpresagpDto: UpdateEmpresagpDto,
  ) {
    return this.empresagpsService.update(id, updateEmpresagpDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.empresagpsService.remove(id);
  }
}
