import { PartialType } from '@nestjs/swagger';
import { CreateEmpresagpDto } from './create-empresagp.dto';

export class UpdateEmpresagpDto extends PartialType(CreateEmpresagpDto) {}
