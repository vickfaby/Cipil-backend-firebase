import { ApiProperty } from '@nestjs/swagger';

export class InvitacionResumenMatchDto {
  @ApiProperty({ description: 'ID de la invitación' })
  invitacion_id: string;

  @ApiProperty({ description: 'ID del resume asociado' })
  resume_id: string;

  @ApiProperty({ description: 'ID del usuario dueño del resume' })
  user_id: string;

  @ApiProperty({ description: 'Datos básicos del resume' })
  resume: any;

  @ApiProperty({ description: 'Datos básicos de la invitación' })
  invitacion: any;
}


