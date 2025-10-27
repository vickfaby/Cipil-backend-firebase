import { PartialType } from '@nestjs/swagger';
import { CreateMarcasvehiculoDto } from './create-marcasvehiculo.dto';

export class UpdateMarcasvehiculoDto extends PartialType(
  CreateMarcasvehiculoDto,
) {}
