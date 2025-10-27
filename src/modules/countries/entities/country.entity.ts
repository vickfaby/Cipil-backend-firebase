import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Country extends Document {
  @Prop()
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  phone_code: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
