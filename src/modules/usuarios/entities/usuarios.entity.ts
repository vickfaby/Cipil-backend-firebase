import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Roles } from 'src/modules/roles/entities/role.entity';
import { Sexo } from 'src/modules/sexo/entities/sexo.entity';
import { Tipodocumentos } from 'src/modules/tipodocumentos/entities/tipodocumentos.entity';

@Schema({ timestamps: true })
export class Usuarios extends Document {
  @Prop()
  @ApiProperty()
  foto: string;

  @Prop()
  @ApiProperty()
  nombre: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tipodocumentos',
  })
  @ApiProperty()
  tipodocumento: Tipodocumentos;

  @Prop()
  @ApiProperty()
  numerodocumento: number;

  @Prop()
  fecha_nacimiento: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sexo',
  })
  sexo: Sexo;

  @Prop({ required: true, unique: true, index: true })
  @ApiProperty()
  correo: string;

  @Prop()
  @ApiProperty()
  password: string;

  @Prop()
  @ApiProperty()
  token: string;

  @Prop({ default: false })
  @ApiProperty()
  estado: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Roles',
  })
  @ApiProperty()
  roles_id: Roles;

  @Prop()
  @ApiProperty()
  hashwallet: string;
}

export const UsuariosSchema = SchemaFactory.createForClass(Usuarios);

UsuariosSchema.methods.toJSON = function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, password, ...usuario } = this.toObject();
  return usuario;
};

// UsuariosSchema.post('save', function (error: any, doc: any, next: any) {
//   if (error.name === 'MongoServerError' && error.code === 1100)
//     next(new Error(`El ${Object.keys(error.keyValue)} ya existe`));
// });
