import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoscargadosengancheDto } from './create-documentoscargadosenganche.dto';

export class UpdateDocumentoscargadosengancheDto extends PartialType(
  CreateDocumentoscargadosengancheDto,
) {}
