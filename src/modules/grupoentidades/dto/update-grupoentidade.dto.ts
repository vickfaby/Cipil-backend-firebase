import { PartialType } from '@nestjs/swagger';
import { CreateGrupoentidadeDto } from './create-grupoentidade.dto';

export class UpdateGrupoentidadeDto extends PartialType(
  CreateGrupoentidadeDto,
) {}
