import { Module } from '@nestjs/common';
import { EventsGateway } from './message/events.gateway';
import { FirebaseService } from './firebase/firebase.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileController } from './profile/profile.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './common/utils/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection, Schema } from 'mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  ColoresModule,
  ClasesvehiculosModule,
  CategoriasModule,
  DocumentosModule,
  DocumentoscargadosresumeModule,
  DocumentoscargadosvehiculoModule,
  DocumentoscargadosengancheModule,
  EmpresagpsModule,
  EntidadesemisorasModule,
  EntidadesModule,
  GrupoentidadesModule,
  GrupodocumentosModule,
  PlacaenganchesModule,
  AnosvehiculosModule,
  MarcasvehiculosModule,
  ModelosvehiculosModule,
  ReferenciasModule,
  InvitacionesModule,
  LigarvehiculoModule,
  InvitacionvehiculoModule,
  ResumeModule,
  ResumevehiculoModule,
  RolesModule,
  SeguridadsocialesModule,
  TipovehiculosModule,
  TipotercerosModule,
  TiporelacionesModule,
  TipocarroceriasModule,
  UsuariosModule,
  AuthModule,
  EventMailModule,
  MailModule,
  LogimpresionesModule,
  MarcaenganchesModule,
  TipodocumentosModule,
  CountriesModule,
  StatesModule,
  CitiesModule,
  TipopersonaModule,
  SexoModule,
  AuditoriadocsoperadorModule,
  AuditoriadocsvehiculoModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV || 'development'}.env`, '.env'],
      load: [config],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('config.mongodb') ||
          configService.get<string>('MONGODB') ||
          'mongodb://localhost:27017/cipil',
        connectionFactory: (connection: Connection) => {
          connection.plugin(mongoose_delete, {
            overrideMethods: 'all',
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ColoresModule,
    ClasesvehiculosModule,
    CategoriasModule,
    DocumentosModule,
    DocumentoscargadosresumeModule,
    DocumentoscargadosvehiculoModule,
    DocumentoscargadosengancheModule,
    EmpresagpsModule,
    EntidadesemisorasModule,
    EntidadesModule,
    GrupoentidadesModule,
    GrupodocumentosModule,
    PlacaenganchesModule,
    AnosvehiculosModule,
    MarcasvehiculosModule,
    ModelosvehiculosModule,
    ReferenciasModule,
    InvitacionesModule,
    LigarvehiculoModule,
    InvitacionvehiculoModule,
    ResumeModule,
    ResumevehiculoModule,
    RolesModule,
    SeguridadsocialesModule,
    TipovehiculosModule,
    TipotercerosModule,
    TiporelacionesModule,
    TipocarroceriasModule,
    UsuariosModule,
    AuthModule,
    EventMailModule,
    MailModule,
    LogimpresionesModule,
    MarcaenganchesModule,
    TipodocumentosModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    TipopersonaModule,
    SexoModule,
    AuditoriadocsoperadorModule,
    AuditoriadocsvehiculoModule,
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService, EventsGateway, FirebaseService],
})
export class AppModule {}
function mongoose_delete(schema: Schema, opts?: any): void {
  // noop plugin placeholder
}
