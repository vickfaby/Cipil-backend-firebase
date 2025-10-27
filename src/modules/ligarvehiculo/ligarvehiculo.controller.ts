import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { LigarvehiculoService } from './ligarvehiculo.service';
import { CreateLigarVehiculoDto } from './dto/create-ligarvehiculo.dto';
import { UpdateLigarVehiculoDto } from './dto/update-ligarvehiculo.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { TipoRelacion } from './entities/tipo-relacion.enum';
import { LigarVehiculo } from './entities/ligarvehiculo.entity';
import { Resumevehiculo } from 'src/modules/resumevehiculo/entities/resumevehiculo.entity';
import { ResumevehiculoService } from 'src/modules/resumevehiculo/resumevehiculo.service';
import { PaginateV2 } from 'src/common/decorators/paginate-v2.decorator';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';

@ApiTags('Ligarvehiculo')
@Controller('ligarvehiculo')
@UseGuards(FirebaseAuthGuard)
export class LigarvehiculoController {
  constructor(private readonly ligarvehiculoService: LigarvehiculoService, private readonly resumevehiculoService: ResumevehiculoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear relación de usuario con vehículo' })
  @ApiBody({ type: CreateLigarVehiculoDto })
  @ApiCreatedResponse({ type: LigarVehiculo })
  create(@Body() dto: CreateLigarVehiculoDto) {
    return this.ligarvehiculoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar relaciones' })
  @ApiQuery({ name: 'tipo_relacion', required: false, enum: TipoRelacion })
  @ApiOkResponse({ type: [LigarVehiculo] })
  findAll(@Query('tipo_relacion') tipoRelacion?: string) {
    return tipoRelacion
      ? (this.ligarvehiculoService as any).findAll(tipoRelacion as any)
      : this.ligarvehiculoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener relación por id' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: LigarVehiculo })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.ligarvehiculoService.findOne(id);
  }

  @Get('/usuario/:usuarioId')
  @ApiOperation({ summary: 'Listar relaciones por usuario a ligar' })
  @ApiParam({ name: 'usuarioId' })
  @ApiQuery({ name: 'tipo_relacion', required: false, enum: TipoRelacion })
  @ApiOkResponse({ type: [LigarVehiculo] })
  findByUsuario(
    @Param('usuarioId', ParseMongoIdPipe) usuarioId: string,
    @Query('tipo_relacion') tipoRelacion?: string,
  ) {
    return tipoRelacion
      ? (this.ligarvehiculoService as any).findByUsuario(usuarioId, tipoRelacion as any)
      : this.ligarvehiculoService.findByUsuario(usuarioId);
  }

  @Get('/resume/:resumeId')
  @ApiOperation({ summary: 'Listar relaciones por vehículo' })
  @ApiParam({ name: 'resumeId' })
  @ApiQuery({ name: 'tipo_relacion', required: false, enum: TipoRelacion })
  @ApiOkResponse({ type: [LigarVehiculo] })
  findByResume(
    @Param('resumeId', ParseMongoIdPipe) resumeId: string,
    @Query('tipo_relacion') tipoRelacion?: string,
  ) {
    return tipoRelacion
      ? (this.ligarvehiculoService as any).findByResume(resumeId, tipoRelacion as any)
      : this.ligarvehiculoService.findByResume(resumeId);
  }

  @Get('/invitante/:usuarioId')
  @ApiOperation({ summary: 'Listar relaciones por usuario invitante' })
  @ApiParam({ name: 'usuarioId' })
  @ApiQuery({ name: 'tipo_relacion', required: false, enum: TipoRelacion })
  @ApiOkResponse({ type: [LigarVehiculo] })
  findByInvitante(
    @Param('usuarioId', ParseMongoIdPipe) usuarioId: string,
    @Query('tipo_relacion') tipoRelacion?: string,
  ) {
    return tipoRelacion
      ? (this.ligarvehiculoService as any).findByInvitante(usuarioId, tipoRelacion as any)
      : this.ligarvehiculoService.findByInvitante(usuarioId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar relación' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateLigarVehiculoDto })
  @ApiOkResponse({ type: LigarVehiculo })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() dto: UpdateLigarVehiculoDto,
  ) {
    return this.ligarvehiculoService.update(id, dto);
  }

  @Patch(':id/aceptar')
  @ApiOperation({ summary: 'Aceptar invitación' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: LigarVehiculo })
  async acceptInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    console.log('acceptInvitation', id);
    
    const ligarvehiculo = await this.ligarvehiculoService.findOne(id);
    if (!ligarvehiculo) {
      throw new BadRequestException('Liga vehículo no encontrada');
    }
    const liga: any = ligarvehiculo;
    const resumevehiculo = await this.resumevehiculoService.findOne(liga.resume_vehiculo_id.id?.toString());
    if (!resumevehiculo) {
      throw new BadRequestException('Resume vehículo no encontrado');
    }
    console.log('Tipo de relación', liga.tipo_relacion);
    switch (liga.tipo_relacion) {
      case TipoRelacion.TENEDOR:
      case TipoRelacion.TENEDOR:
        resumevehiculo.tenedor_liga_id = liga.id;
        break;
      case TipoRelacion.PROPIETARIO:
        resumevehiculo.propietario_liga_id = liga.id;
        break;
      case TipoRelacion.CONDUCTOR:
        resumevehiculo.operador_liga_id = liga.id;
        break;
    }
    console.log('id propietario a ligar', resumevehiculo.propietario_liga_id.id?.toString());
    await this.resumevehiculoService.updateAceptarLiga(resumevehiculo.id, resumevehiculo);
    return this.ligarvehiculoService.acceptInvitation(id);
  }

  @Patch(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar invitación' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: LigarVehiculo })
  rejectInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.ligarvehiculoService.rejectInvitation(id);
  }

  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar invitación' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: LigarVehiculo })
  cancelInvitation(@Param('id', ParseMongoIdPipe) id: string) {
    return this.ligarvehiculoService.cancelInvitation(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar relación (soft delete)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.ligarvehiculoService.remove(id);
  }
}


@ApiTags('Ligarvehiculo')
@Controller('resumevehiculo')
@UseGuards(FirebaseAuthGuard)
export class LigarvehiculoResumeController {
  constructor(private readonly ligarvehiculoService: LigarvehiculoService) {}

  @Get('/by-usuario-a-ligar/:userId/invitaciones')
  findResumeWithLigarsByUser(
    @Param('userId', ParseMongoIdPipe) userId: string,
    @PaginateV2() pagination: any,
  ) {
    return this.ligarvehiculoService.findResumeWithLigarsByUser(userId, pagination);
  }
}

