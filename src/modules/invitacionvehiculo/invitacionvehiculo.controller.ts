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

import { InvitacionvehiculoService } from './invitacionvehiculo.service';
import { CreateInvitacionVehiculoDto } from './dto/create-invitacionvehiculo.dto';
import { UpdateInvitacionVehiculoDto } from './dto/update-invitacionvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginateV2 } from 'src/common/decorators/paginate-v2.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Invitacionvehiculo')
@Controller('invitacionvehiculo')
@UseGuards(FirebaseAuthGuard)
export class InvitacionvehiculoController {
  constructor(private readonly invitacionvehiculoService: InvitacionvehiculoService) {}

  @Post()
  create(@Body() dto: CreateInvitacionVehiculoDto) {
    return this.invitacionvehiculoService.create(dto);
  }

  @Get()
  findAll() {
    return this.invitacionvehiculoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionvehiculoService.findOne(id);
  }

  @Get('/usuario/:usuarioId')
  findByUsuario(@Param('usuarioId', ParseMongoIdPipe) usuarioId: string) {
    return this.invitacionvehiculoService.findByUsuario(usuarioId);
  }

  @Get('/resume/:resumeId')
  findByResume(@Param('resumeId', ParseMongoIdPipe) resumeId: string) {
    return this.invitacionvehiculoService.findByResume(resumeId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateInvitacionVehiculoDto,
  ) {
    return this.invitacionvehiculoService.update(id, dto);
  }

  @Patch(':id/aceptar')
  acceptInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionvehiculoService.acceptInvitation(id);
  }

  @Patch(':id/rechazar')
  rejectInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionvehiculoService.rejectInvitation(id);
  }

  @Patch(':id/cancelar')
  cancelInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionvehiculoService.cancelInvitation(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionvehiculoService.remove(id);
  }
}


@ApiTags('Invitacionvehiculo')
@Controller('resumevehiculo')
@UseGuards(FirebaseAuthGuard)
export class InvitacionvehiculoResumeController {
  constructor(private readonly invitacionvehiculoService: InvitacionvehiculoService) {}

  @Get('/by-user/:userId/invitaciones')
  findResumeWithInvitationsByUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.invitacionvehiculoService.findResumeWithInvitationsByUser(
      userId,
      pagination,
    );
  }
}

