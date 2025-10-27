import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Grupodocumentos } from '../../grupodocumentos/entities/grupodocumentos.entity';

@Schema({ timestamps: true })
export class Documentos extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grupodocumentos',
  })
  grupodocumento: Grupodocumentos;

  @Prop()
  nombre_documento: string;
}

export const DocumentosSchema = SchemaFactory.createForClass(Documentos);
