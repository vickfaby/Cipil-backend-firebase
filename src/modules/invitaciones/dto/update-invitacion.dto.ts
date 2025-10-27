import { PartialType } from '@nestjs/swagger';
import { CreateInvitacionDto } from './create-invitacion.dto';

export class UpdateInvitacionDto extends PartialType(CreateInvitacionDto) {}
