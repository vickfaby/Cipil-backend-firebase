import { PartialType } from '@nestjs/swagger';
import { CreateTipovehiculosDto } from './create-tipovehiculos.dto';

export class UpdateTipovehiculosDto extends PartialType(
  CreateTipovehiculosDto,
) {}
