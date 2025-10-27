import { PartialType } from '@nestjs/swagger';
import { CreateResumevehiculoDto } from './create-resumevehiculo.dto';

export class UpdateResumevehiculoDto extends PartialType(
  CreateResumevehiculoDto,
) {}
