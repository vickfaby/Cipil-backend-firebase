import { PartialType } from '@nestjs/mapped-types';
import { CreatePosiciondisponibleDto } from './create-posicion_disponible.dto';

export class UpdatePosiciondisponibleDto extends PartialType(
  CreatePosiciondisponibleDto,
) {}

