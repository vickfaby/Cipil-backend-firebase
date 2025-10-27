import { PartialType } from '@nestjs/swagger';
import { CreateColoreDto } from './create-colores.dto';

export class UpdateColoreDto extends PartialType(CreateColoreDto) {}
