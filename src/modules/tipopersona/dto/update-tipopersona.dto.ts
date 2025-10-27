import { PartialType } from '@nestjs/swagger';
import { CreateTipopersonaDto } from './create-tipopersona.dto';

export class UpdateTipopersonaDto extends PartialType(CreateTipopersonaDto) {}
