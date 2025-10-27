import { PartialType } from '@nestjs/swagger';
import { CreateModelosvehiculoDto } from './create-modelosvehiculo.dto';

export class UpdateModelosvehiculoDto extends PartialType(
  CreateModelosvehiculoDto,
) {}
