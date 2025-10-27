import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { resolve } from "path";
import { Logger } from "@nestjs/common";
const logger = new Logger('Running Mail Module');
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {

        // DEBUG: Imprimir variables de entorno
        logger.log('🔍 [MAIL MODULE DEBUG] NODE_ENV:', process.env.NODE_ENV);
        logger.log('🔍 [MAIL MODULE DEBUG] SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.substring(0, 10)}...` : 'NO DEFINIDA');
        logger.log('🔍 [MAIL MODULE DEBUG] SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL || 'NO DEFINIDA');
        
        // En desarrollo, usar configuración mock para evitar verificación de SendGrid
        if (process.env.NODE_ENV === 'development') {
          logger.log('📧 [MAIL MODULE] Configurando transporter para DESARROLLO (mock SMTP)');
          return {
            transport: {
              host: 'localhost',
              port: 1025,
              ignoreTLS: true,
              secure: false,
              auth: {
                user: 'test',
                pass: 'test'
              }
            },
            defaults: {
              from: `"Servicio al cliente CIPIL (DESARROLLO)" <${process.env.SENDGRID_FROM_EMAIL || 'confirm@jobty.app'}>`,
            },
            template: {
              dir: resolve(__dirname, "./templates"),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
            preview: false,
          };
        }

        // Configuración mock para producción (usando misma solución que desarrollo)
        logger.log('🚀 [MAIL MODULE] Configurando transporter para PRODUCCIÓN (mock SMTP)');
        return {
          transport: {
            host: 'localhost',
            port: 1025,
            ignoreTLS: true,
            secure: false,
            auth: {
              user: 'test',
              pass: 'test'
            }
          },
          defaults: {
            from: `"Servicio al cliente CIPIL (PRODUCCIÓN)" <${process.env.SENDGRID_FROM_EMAIL}>`,
          },
          template: {
            dir: resolve(__dirname, "./templates"),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          preview: false,
        };
      },
    }),
  ],
})
export class MailModule {}
