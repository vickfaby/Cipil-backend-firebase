import { PartialType } from '@nestjs/swagger';
import { CreateEntidadesemisorasDto } from './create-entidadesemisora.dto';

export class UpdateEntidadesemisorasDto extends PartialType(
  CreateEntidadesemisorasDto,
) {}
