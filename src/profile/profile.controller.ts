import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('profile')
@UseGuards(FirebaseAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@Req() req) {
    Logger.log('🔥 Usuario autenticado:', req.user.email);
    return {
      message: 'Acceso permitido ✅',
      user: req.user,
    };
  }
  @Get('free')
  getProfileFree(@Req() req) {
    return {
      message: 'Acceso sin restricciones ✅',
    };
  }
}
