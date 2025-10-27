import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LogimpresionesService } from './logimpresiones.service';
import { CreateLogimpresionesDto } from './dto/create-logimpresiones.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@Controller('logimpresiones')
@UseGuards(FirebaseAuthGuard)
export class LogimpresionesController {
  constructor(private readonly logimpresionesService: LogimpresionesService) {}

  @Post()
  create(@Body() createLogimpresioneDto: CreateLogimpresionesDto) {
    return this.logimpresionesService.create(createLogimpresioneDto);
  }

  @Get()
  findAll() {
    return this.logimpresionesService.findAll();
  }

  @Get('/resume/:resume_id')
  findOneResume(@Param('resume_id') resume_id: string) {
    return this.logimpresionesService.findOneResume(resume_id);
  }

  @Get('/resumevehicule/:resumevehiculo_id')
  findOneResumeVehicle(@Param('resumevehiculo_id') resumevehiculo_id: string) {
    return this.logimpresionesService.findOneResumeVehicle(resumevehiculo_id);
  }
}
