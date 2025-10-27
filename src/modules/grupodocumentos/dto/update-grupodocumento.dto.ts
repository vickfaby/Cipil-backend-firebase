import { PartialType } from '@nestjs/swagger';
import { CreateGrupodocumentoDto } from './create-grupodocumento.dto';

export class UpdateGrupodocumentoDto extends PartialType(
  CreateGrupodocumentoDto,
) {}
