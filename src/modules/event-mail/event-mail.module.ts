import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';

import { RegisterAuthDto } from '../auth/dto/register-auth.dto';
import { ActiveAuthDto } from '../auth/dto/active-auth.dto';
import { ChangePasswordAuthDto } from '../auth/dto/change-pass-auth.dto';

@Module({})
export class EventMailModule {
  constructor(private readonly mailService: MailerService) {}

  @OnEvent('usuario.register')
  async handleUsuarioRegistredEvent(usuario: RegisterAuthDto) {
    // FORZAR MODO DESARROLLO TEMPORALMENTE
    console.log('📧 [EMAIL MOCK] Correo de bienvenida para:', usuario.correo);
    console.log('�� [EMAIL MOCK] Token de activación:', `http://localhost:3002/auth/activeaccount?token=${usuario.token}&correo=${usuario.correo}`);
    return; // Salir sin enviar correo

    // PRODUCCIÓN: Envío real de email
    this.mailService.sendMail({
      to: usuario.correo, // list of receivers
      from: process.env.SENDGRID_FROM_EMAIL, // sender address
      subject: 'Nueva cuenta creada en CIPIL', // Subject line
      template: 'welcome',
      context: {
        // Data to be sent to template engine..
        nombre: usuario.nombre,
        token: `http://localhost:3000/auth/activeaccount?token=${usuario.token}&correo=${usuario.correo}`,
      },
    });
  }

  @OnEvent('usuario.actived')
  async handleUsuarioActivedEvent(usuario: ActiveAuthDto) {
    // MODO DESARROLLO: Solo log en consola mientras se configuran los créditos de SendGrid
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [EMAIL MOCK] Cuenta activada para:', usuario.correo);
      return;
    }

    // PRODUCCIÓN: Envío real de email
    this.mailService.sendMail({
      to: usuario.correo, // list of receivers
      from: process.env.SENDGRID_FROM_EMAIL, // sender address
      subject: 'Cuenta de usuario de CIPIL ACTIVADA!', // Subject line
      template: 'active',
      context: {
        // Data to be sent to template engine..
        correo: usuario.correo,
        nombre: usuario.nombre,
      },
    });
  }

  @OnEvent('usuario.update')
  async handleUsuarioPassEvent(usuario: ChangePasswordAuthDto) {
    // MODO DESARROLLO: Solo log en consola mientras se configuran los créditos de SendGrid
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [EMAIL MOCK] Contraseña cambiada para:', usuario.correo);
      return;
    }

    // PRODUCCIÓN: Envío real de email
    this.mailService.sendMail({
      to: usuario.correo, // list of receivers
      from: process.env.SENDGRID_FROM_EMAIL, // sender address
      subject: 'Confirmación de cambio de contraseña', // Subject line
      template: 'password',
      context: {
        // Data to be sent to template engine..
        nombre: usuario.correo,
        hora: usuario.updatedAt,
      },
    });
  }
}
