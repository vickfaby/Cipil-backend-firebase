import { PartialType } from '@nestjs/swagger';
import { CreateEntidadesDto } from './create-entidades.dto';

export class UpdateEntidadesDto extends PartialType(CreateEntidadesDto) {}
