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
import { PosiciondisponibleService } from './posicion_disponible.service';
import { CreatePosiciondisponibleDto } from './dto/create-posicion_disponible.dto';
import { UpdatePosiciondisponibleDto } from './dto/update-posicion_disponible.dto';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Posicion disponible')
@ApiBearerAuth()
@Controller('posicion-disponible')
@UseGuards(FirebaseAuthGuard)
export class PosiciondisponibleController {
  constructor(
    private readonly posiciondisponibleService: PosiciondisponibleService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una nueva posición disponible',
    description:
      'Crea una nueva posición disponible asociada a un conductor (resume_id) o un vehículo (resumevehiculo_id). No se pueden enviar ambos IDs simultáneamente.',
  })
  @ApiBody({
    type: CreatePosiciondisponibleDto,
    examples: {
      conductor: {
        summary: 'Ejemplo con conductor',
        value: {
          direccion: 'Av. Siempre Viva 123',
          latitud: 4.60971,
          longitud: -74.08175,
          resume_id: '64f1b2c3d4e5f6a7b8c9d0e1',
        },
      },
      vehiculo: {
        summary: 'Ejemplo con vehículo',
        value: {
          direccion: 'Calle 100 # 15-20',
          latitud: 4.60971,
          longitud: -74.08175,
          resumevehiculo_id: '64f1b2c3d4e5f6a7b8c9d0e2',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Posición creada exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Solicitud incorrecta. Puede ocurrir si se envían ambos IDs (resume_id y resumevehiculo_id) o ninguno.',
  })
  @ApiResponse({
    status: 404,
    description:
      'No encontrado. Ocurre si el resume_id o resumevehiculo_id proporcionado no existe.',
  })
  create(@Body() createPosiciondisponibleDto: CreatePosiciondisponibleDto) {
    return this.posiciondisponibleService.create(createPosiciondisponibleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las posiciones disponibles',
    description: 'Retorna una lista de todas las posiciones disponibles registradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de posiciones obtenida exitosamente.',
  })
  findAll() {
    return this.posiciondisponibleService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una posición disponible por ID',
    description: 'Retorna los detalles de una posición disponible específica.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la posición disponible',
    example: '64f1b2c3d4e5f6a7b8c9d0e3',
  })
  @ApiResponse({
    status: 200,
    description: 'Posición encontrada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Posición no encontrada.',
  })
  findOne(@Param('id') id: string) {
    return this.posiciondisponibleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una posición disponible',
    description: 'Actualiza los datos de una posición disponible existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la posición disponible a actualizar',
    example: '64f1b2c3d4e5f6a7b8c9d0e3',
  })
  @ApiBody({
    type: UpdatePosiciondisponibleDto,
    examples: {
      actualizacion: {
        summary: 'Ejemplo de actualización',
        value: {
          direccion: 'Nueva dirección 456',
          latitud: 4.7110,
          longitud: -74.0721,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Posición actualizada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Posición no encontrada.',
  })
  update(
    @Param('id') id: string,
    @Body() updatePosiciondisponibleDto: UpdatePosiciondisponibleDto,
  ) {
    return this.posiciondisponibleService.update(
      id,
      updatePosiciondisponibleDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una posición disponible',
    description: 'Elimina una posición disponible de la base de datos.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la posición disponible a eliminar',
    example: '64f1b2c3d4e5f6a7b8c9d0e3',
  })
  @ApiResponse({
    status: 200,
    description: 'Posición eliminada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Posición no encontrada.',
  })
  remove(@Param('id') id: string) {
    return this.posiciondisponibleService.remove(id);
  }
}

