import { PartialType } from '@nestjs/swagger';
import { CreateSexoDto } from './create-sexo.dto';

export class UpdateSexoDto extends PartialType(CreateSexoDto) {}
