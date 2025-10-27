import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoscargadosresumeDto } from './create-documentoscargadosresume.dto';

export class UpdateDocumentoscargadosresumeDto extends PartialType(
  CreateDocumentoscargadosresumeDto,
) {}
