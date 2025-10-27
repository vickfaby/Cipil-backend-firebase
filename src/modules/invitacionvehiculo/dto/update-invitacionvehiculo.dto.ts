import { PartialType } from '@nestjs/swagger';
import { CreateInvitacionVehiculoDto } from './create-invitacionvehiculo.dto';

export class UpdateInvitacionVehiculoDto extends PartialType(CreateInvitacionVehiculoDto) {}


