import { PartialType } from '@nestjs/swagger';
import { CreatePlacaenganchesDto } from './create-placaenganches.dto';

export class UpdatePlacaenganchesDto extends PartialType(
  CreatePlacaenganchesDto,
) {}
