import { Model, Types } from 'mongoose';
import { Resume } from 'src/modules/resume/entities/resume.entity';
import { Referencias } from 'src/modules/referencias/entities/referencias.entity';
import { Seguridadsociales } from 'src/modules/seguridadsociales/entities/seguridadsociales.entity';
import { Documentoscargadosresume } from 'src/modules/documentoscargadosresume/entities/documentoscargadosresume.entity';

export interface ModelExt<T> extends Model<T> {
  delete: (data: { _id: Types.ObjectId }) => void;
  paginate: (query: any, pagination: any) => void;
}

export interface Data {
  basic: Resume;
  entidades: Seguridadsociales[];
  referencias: Referencias[];
  documentos: Documentoscargadosresume[];
  type: number;
  head: number;
}
