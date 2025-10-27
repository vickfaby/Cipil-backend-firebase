import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Anosvehiculos } from 'src/modules/anosvehiculos/entities/anosvehiculos.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Clasesvehiculos } from '../../clasesvehiculos/entities/clasesvehiculos.entity';
import { Colores } from '../../colores/entities/colores.entity';
import { Documentoscargadosvehiculo } from '../../documentoscargadosvehiculo/entities/documentoscargadosvehiculo.entity';
import { Empresagps } from '../../empresagps/entities/empresagps.entity';
import { Marcasvehiculos } from '../../marcasvehiculos/entities/marcasvehiculos.entity';
import { Modelosvehiculos } from '../../modelosvehiculos/entities/modelosvehiculos.entity';
import { Tipocarrocerias } from '../../tipocarrocerias/entities/tipocarrocerias.entity';
import { Tipovehiculos } from '../../tipovehiculos/entities/tipovehiculos.entity';
import { Documentoscargadosenganche } from 'src/modules/documentoscargadosenganche/entities/documentoscargadosenganche.entity';
import { Tipodocumentos } from 'src/modules/tipodocumentos/entities/tipodocumentos.entity';
import { LigarVehiculo } from 'src/modules/ligarvehiculo/entities/ligarvehiculo.entity';

@Schema({ timestamps: true })
export class Resumevehiculo extends Document {
  @Prop([String])
  fotos: string[];

  @Prop({ index: true, unique: true })
  placa: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipovehiculos',
  })
  tipovehiculo_id: Tipovehiculos;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marcasvehiculos',
  })
  marca_id: Marcasvehiculos;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anosvehiculos',
  })
  ano_id: Anosvehiculos;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modelosvehiculos',
  })
  modelo_id: Modelosvehiculos;

  @Prop()
  modelo: string;

  @Prop()
  modelo_repotenciado: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colores',
  })
  color_id: Colores;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipocarrocerias',
  })
  tipocarroceria_id: Tipocarrocerias;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clasesvehiculos',
  })
  clasevehiculo_id: Clasesvehiculos;

  @Prop()
  configuracionvehicular: string;

  @Prop()
  numero_motor: string;

  @Prop()
  numero_serie: string;

  @Prop()
  numero_chasis: string;

  @Prop()
  peso_vacio: string;

  @Prop()
  capacidad: string;

  @Prop()
  propietario_id: string;

  @Prop()
  tenedor_id: string;

  @Prop()
  operador_id: string;

  

  @Prop()
  tipo_servicio: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresagps',
  })
  empresagps_id: Empresagps;

  @Prop()
  paginaweb_gps: string;

  @Prop()
  usuario_gps: string;

  @Prop()
  clave_gps: string;

  @Prop()
  ubicacion: string;

  @Prop()
  calificacion: string;

  @Prop()
  ruta_frecuente: string;

  @Prop({ unique: true, default: '' })
  placa_enganche: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Documentoscargadosvehiculo',
    },
  ])
  documentosvehiculo: Documentoscargadosvehiculo[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Documentoscargadosenganche',
    },
  ])
  documentosenganche: Documentoscargadosenganche[];

  @Prop()
  progreso: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
  })
  user_id: Usuarios;

  @Prop({ default: false })
  status: boolean;

  // Datos propietarios/tenedor/operador
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipodocumentos',
    required: false,
  })
  tipo_doc_propietario_id: Tipodocumentos;

  @Prop()
  num_documento_propietario: string;

  @Prop()
  email_propietario: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipodocumentos',
    required: false,
  })
  tipo_doc_tenedor_id: Tipodocumentos;

  @Prop()
  num_documento_tenedor: string;

  @Prop()
  email_tenedor: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipodocumentos',
    required: false,
  })
  tipo_doc_operador_id: Tipodocumentos;

  @Prop()
  num_documento_operador: string;

  @Prop()
  email_operador: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LigarVehiculo',
    required: false,
  })
  tenedor_liga_id: LigarVehiculo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LigarVehiculo',
    required: false,
  })
  propietario_liga_id: LigarVehiculo;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LigarVehiculo',
    required: false,
  })
  operador_liga_id: LigarVehiculo;
}

export const ResumevehiculoSchema =
  SchemaFactory.createForClass(Resumevehiculo);
