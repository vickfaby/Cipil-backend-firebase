import { PartialType } from '@nestjs/swagger';
import { CreateTipoterceroDto } from './create-tipotercero.dto';

export class UpdateTipoterceroDto extends PartialType(CreateTipoterceroDto) {}
