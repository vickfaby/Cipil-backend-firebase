import { PartialType } from '@nestjs/swagger';
import { CreateSeguridadsocialeDto } from './create-seguridadsociale.dto';
import { IsOptional } from 'class-validator';

export class UpdateSeguridadsocialeDto extends PartialType(
  CreateSeguridadsocialeDto,
) {}
