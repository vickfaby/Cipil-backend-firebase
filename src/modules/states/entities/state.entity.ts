import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class State extends Document {
  @Prop()
  declare id: number;

  @Prop()
  name: string;

  @Prop()
  country_id: number;

  @Prop()
  country_code: string;

  @Prop()
  state_code: string;

  @Prop()
  latitude: string;

  @Prop()
  longitude: string;
}

export const StateSchema = SchemaFactory.createForClass(State);
