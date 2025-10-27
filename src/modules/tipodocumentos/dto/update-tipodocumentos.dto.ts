import { PartialType } from '@nestjs/swagger';
import { CreateTipodocumentosDto } from './create-tipodocumentos.dto';

export class UpdateTipodocumentosDto extends PartialType(
  CreateTipodocumentosDto,
) {}
