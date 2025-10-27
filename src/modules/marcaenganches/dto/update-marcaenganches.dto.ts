import { PartialType } from '@nestjs/swagger';
import { CreateMarcaenganchesDto } from './create-marcaenganches.dto';

export class UpdateMarcaenganchesDto extends PartialType(
  CreateMarcaenganchesDto,
) {}
