import { PartialType } from '@nestjs/swagger';
import { CreateTiporelacionesDto } from './create-tiporelaciones.dto';

export class UpdateTiporelacionesDto extends PartialType(
  CreateTiporelacionesDto,
) {}
