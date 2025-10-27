import { PartialType } from '@nestjs/swagger';
import { CreateClasesvehiculoDto } from './create-clasesvehiculo.dto';

export class UpdateClasesvehiculoDto extends PartialType(
  CreateClasesvehiculoDto,
) {}
