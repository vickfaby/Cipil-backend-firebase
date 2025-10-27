import { PartialType } from '@nestjs/swagger';
import { CreateTipocarroceriaDto } from './create-tipocarroceria.dto';

export class UpdateTipocarroceriaDto extends PartialType(
  CreateTipocarroceriaDto,
) {}
