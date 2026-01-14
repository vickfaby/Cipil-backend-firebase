import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Documentos } from 'src/modules/documentos/entities/documentos.entity';

@Schema({ 
  timestamps: true, 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
})
export class Grupodocumentos extends Document {
  @Prop()
  nombre_documento: string;

  documentos?: Documentos[];
}

export const GrupodocumentosSchema =
  SchemaFactory.createForClass(Grupodocumentos);

GrupodocumentosSchema.virtual('documentos', {
  ref: 'Documentos',
  localField: '_id',
  foreignField: 'grupodocumento',
});
