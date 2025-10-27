import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { InvitacionesService } from './invitaciones.service';
import { CreateInvitacionDto } from './dto/create-invitacion.dto';
import { UpdateInvitacionDto } from './dto/update-invitacion.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginateV2 } from 'src/common/decorators/paginate-v2.decorator';

@ApiTags('Invitaciones')
@Controller('invitaciones')
export class InvitacionesController {
  constructor(private readonly invitacionesService: InvitacionesService) {}

  @Post()
  create(@Body() createInvitacionDto: CreateInvitacionDto) {
    return this.invitacionesService.create(createInvitacionDto);
  }

  @Get()
  findAll() {
    return this.invitacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionesService.findOne(id);
  }

  @Get('/usuario/:usuarioId')
  findByUsuario(@Param('usuarioId', ParseMongoIdPipe) usuarioId: string) {
    return this.invitacionesService.findByUsuario(usuarioId);
  }

  @Get('/resume/:resumeId')
  findByResume(@Param('resumeId', ParseMongoIdPipe) resumeId: string) {
    return this.invitacionesService.findByResume(resumeId);
  }

  @Get('/matches/usuario/:usuarioId')
  findMatchesByUsuario(
    @Param('usuarioId', ParseMongoIdPipe) usuarioId: string,
  ) {
    return this.invitacionesService.findMatchesByUsuario(usuarioId);
  }

  @Get('/debug/usuario/:usuarioId')
  debugInvitacionesByUsuario(
    @Param('usuarioId', ParseMongoIdPipe) usuarioId: string,
  ) {
    return this.invitacionesService.debugInvitacionesByUsuario(usuarioId);
  }

  // Endpoint unificado: todas las invitaciones recibidas por usuario (operador, vehículo, ligadura)
  @Get('/recibidas/by-user/:usuarioId')
  findAllReceivedInvitationsByUser(
    @Param('usuarioId', ParseMongoIdPipe) usuarioId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.invitacionesService.findAllReceivedInvitationsByUser(
      usuarioId,
      pagination,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateInvitacionDto: UpdateInvitacionDto,
  ) {
    return this.invitacionesService.update(id, updateInvitacionDto);
  }

  @Patch(':id/aceptar')
  acceptInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionesService.acceptInvitation(id);
  }

  @Patch(':id/rechazar')
  rejectInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionesService.rejectInvitation(id);
  }

  @Patch(':id/cancelar')
  cancelInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionesService.cancelInvitation(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionesService.remove(id);
  }

  // ENDPOINT TEMPORAL: Corregir invitación con IDs válidos
  @Patch(':id/fix')
  fixWithValidIds(@Param('id', ParseMongoIdPipe) id: string) {
    return this.invitacionesService.fixInvitacionWithValidIds(id);
  }
}

@ApiTags('Invitaciones')
@Controller('resume')
export class InvitacionesResumeController {
  constructor(private readonly invitacionesService: InvitacionesService) {}

  @Get('/by-user/:userId/invitaciones')
  findResumeWithInvitationsByUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.invitacionesService.findResumeWithInvitationsByUser(
      userId,
      pagination,
    );
  }
}
