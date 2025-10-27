import { PartialType } from '@nestjs/swagger';
import { CreateUsuariosDto } from './create-usuarios.dto';

export class UpdateUsuariosDto extends PartialType(CreateUsuariosDto) {}
