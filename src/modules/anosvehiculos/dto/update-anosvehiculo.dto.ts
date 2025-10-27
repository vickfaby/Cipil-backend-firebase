import { PartialType } from '@nestjs/swagger';
import { CreateAnosvehiculoDto } from './create-anosvehiculo.dto';

export class UpdateAnosvehiculoDto extends PartialType(CreateAnosvehiculoDto) {}
