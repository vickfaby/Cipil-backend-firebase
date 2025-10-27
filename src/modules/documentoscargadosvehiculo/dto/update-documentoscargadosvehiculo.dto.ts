import { PartialType } from '@nestjs/swagger';
import { CreateDocumentoscargadosvehiculoDto } from './create-documentoscargadosvehiculo.dto';

export class UpdateDocumentoscargadosvehiculoDto extends PartialType(
  CreateDocumentoscargadosvehiculoDto,
) {}
