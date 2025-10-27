import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateDocumentoscargadosresumeDto } from './dto/create-documentoscargadosresume.dto';
import { UpdateDocumentoscargadosresumeDto } from './dto/update-documentoscargadosresume.dto';
import { Documentoscargadosresume } from './entities/documentoscargadosresume.entity';
import { FindUserDocumentoDto } from './dto/find-userdocumentovencido.dto';

@Injectable()
export class DocumentoscargadosresumeService {
  constructor(
    @InjectModel(Documentoscargadosresume.name)
    private readonly documentoscargadosresumeModel: ModelExt<Documentoscargadosresume>,
  ) {}

  async create(
    createDocumentoscargadosresumeDto: CreateDocumentoscargadosresumeDto,
  ) {
    try {
      const documentoscargadosresume =
        await this.documentoscargadosresumeModel.create(
          createDocumentoscargadosresumeDto,
        );
      return documentoscargadosresume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.documentoscargadosresumeModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.documentoscargadosresumeModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByResume(resume: string) {
    try {
      return await this.documentoscargadosresumeModel
        .find({
          resume_id: resume,
          deleted: false,
        })
        .populate([
          {
            path: 'grupodocumento_id',
            select: 'nombre_documento -_id',
          },
        ])
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento -_id',
          },
        ])
        .populate([
          {
            path: 'entidad_emisora',
            select: 'nombre_entidad -_id',
          },
        ])
        .select('-resume_id -__v -_id -deleted -createdAt -updatedAt -user_id')
        .sort({ createAt: 1 });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUser(findUserDocumentoDto: FindUserDocumentoDto) {
    try {
      //todo change ajustar fecha para que verifique si hay documentos vencidos segun la fecha de vencimiento
      const filter = {
        user_id: new Types.ObjectId(findUserDocumentoDto.user_id),
        fecha_vencimiento: { $lte: findUserDocumentoDto.date },
        deleted: false,
      };
      const expiredDocuments = await this.documentoscargadosresumeModel
        .find(filter)
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento _id',
          },
        ])
        .select('-__v');

      for (const obj of expiredDocuments) {
        obj.estado_documento = 2;
        await this.documentoscargadosresumeModel.updateOne({ _id: obj._id }, { estado_documento: 2 });
      }
      return expiredDocuments;
    } catch (error) {
      return error;
    }
  }

  async findDocumentsByUser(findUserDocumentoDto: FindUserDocumentoDto) {
    try {
      //todo: agregar el group
      const filter = {
        user_id: new Types.ObjectId(findUserDocumentoDto.user_id),
        deleted: false,
      };
      const Documents = await this.documentoscargadosresumeModel
        .find(filter)
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento _id',
          },
        ])
        .select('-__v');
      return Documents;
    } catch (error) {
      return error;
    }
  }

  async insertManyDocumentoscargadosresume(
    createDocumentoscargadosresumeDto: CreateDocumentoscargadosresumeDto[],
  ) {
    return await this.documentoscargadosresumeModel.insertMany(
      createDocumentoscargadosresumeDto,
    );
  }

  async updateManyDocumentoscargadosresume(
    updateDocumentoscargadosresumeDto: UpdateDocumentoscargadosresumeDto[],
  ) {
    // console.log(
    //   'updateDocumentoscargadosresumeDto: ',
    //   updateDocumentoscargadosresumeDto,
    // );
    try {
      const arrayToUpdate = updateDocumentoscargadosresumeDto;
      const savedIds: Types.ObjectId[] = [];
      let filter: { _id: Types.ObjectId; deleted?: boolean };
      for (const obj of arrayToUpdate) {
        if (obj.hasOwnProperty('_id') === false) {
          filter = { _id: new mongoose.Types.ObjectId() };
          //console.log('no trae la propiedad', filter);
        } else {
          filter = { _id: new Types.ObjectId(obj._id as any), deleted: false };
          //console.log('trae la propiedad', filter);
        }
        const update = {
          categoria: obj.categoria,
          codigo_referencia: obj.codigo_referencia,
          documento: obj.documento,
          documento_id: obj.documento_id,
          entidad_emisora: obj.entidad_emisora,
          estado_documento: obj.estado_documento,
          fecha_expedicion: obj.fecha_expedicion,
          fecha_vencimiento: obj.fecha_vencimiento,
          grupodocumento_id: obj.grupodocumento_id,
          nombre: obj.nombre,
          observaciones: obj.observaciones,
          resume_id: obj.resume_id,
          user_id: obj.user_id,
        };
        await this.documentoscargadosresumeModel.updateOne(filter, update, {
          upsert: true,
        });
        savedIds.push(filter._id);
      }
      return savedIds;
    } catch (error) {
      console.log(error);
    }
  }

  async updateManyDocumentoscargadosresumePreservingIds(
    updateDocumentoscargadosresumeDto: UpdateDocumentoscargadosresumeDto[],
    existingDocuments: any[],
  ) {
    try {
      console.log('🔍 DEBUG updateManyDocumentoscargadosresumePreservingIds');
      console.log('Documentos existentes recibidos:', existingDocuments?.length);
      console.log('Documentos en DTO recibidos:', updateDocumentoscargadosresumeDto?.length);

      const savedIds: Types.ObjectId[] = [];
      
      // Crear Set con los IDs existentes (normalizar a string)
      const existingIds = new Set(
        existingDocuments.map((doc) => {
          const id = doc._id?.toString() || doc.toString();
          console.log('ID existente detectado:', id);
          return id;
        }),
      );

      console.log('Set de IDs existentes:', Array.from(existingIds));

      for (const newDoc of updateDocumentoscargadosresumeDto) {
        const newDocId = newDoc._id?.toString();
        console.log(`\n📄 Procesando documento con ID: ${newDocId || 'SIN ID (nuevo)'}`);
        
        if (newDoc._id && existingIds.has(newDocId)) {
          // ACTUALIZAR documento existente manteniendo su _id
          console.log(`🔄 Actualizando documento existente: ${newDocId}`);
          
          const update = {
            categoria: newDoc.categoria,
            codigo_referencia: newDoc.codigo_referencia,
            documento: newDoc.documento,
            documento_id: newDoc.documento_id,
            entidad_emisora: newDoc.entidad_emisora,
            estado_documento: newDoc.estado_documento,
            fecha_expedicion: newDoc.fecha_expedicion,
            fecha_vencimiento: newDoc.fecha_vencimiento,
            grupodocumento_id: newDoc.grupodocumento_id,
            nombre: newDoc.nombre,
            observaciones: newDoc.observaciones,
            resume_id: newDoc.resume_id,
            user_id: newDoc.user_id,
          };

          await this.documentoscargadosresumeModel.updateOne(
            { _id: newDoc._id, deleted: false },
            update,
          );

          savedIds.push(new Types.ObjectId(newDoc._id as any));
          console.log(`✅ Documento actualizado exitosamente: ${newDoc._id}`);
        } else {
          // CREAR nuevo documento
          console.log(`➕ Creando nuevo documento (ID no existe o es nulo)`);
          
          const { _id, ...docData } = newDoc as any;
          delete docData.__v;
          
          const created = await this.documentoscargadosresumeModel.create(
            docData,
          );
          savedIds.push(created._id as Types.ObjectId);
          console.log(`✨ Nuevo documento creado con ID: ${created._id}`);
        }
      }

      console.log('\n📊 Resumen:');
      console.log('Total de IDs guardados:', savedIds.length);
      console.log('IDs finales:', savedIds.map((id) => id.toString()));

      return savedIds;
    } catch (error) {
      console.log('❌ Error en updateManyDocumentoscargadosresumePreservingIds:', error);
      throw error;
    }
  }

  async updateOne(
    id: string,
    updateDocumentoscargadosresumeDto: UpdateDocumentoscargadosresumeDto,
  ) {
    const documentocargadoresume = await this.findOne(id);
    try {
      if (!documentocargadoresume) {
        throw new NotFoundException('Documento cargado no encontrado');
      }
      updateDocumentoscargadosresumeDto.estado_documento = 2;
      await documentocargadoresume.updateOne(updateDocumentoscargadosresumeDto);
      return {
        ...documentocargadoresume.toJSON(),
        ...updateDocumentoscargadosresumeDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(
    id: string,
    updateDocumentoscargadosresumeDto: UpdateDocumentoscargadosresumeDto,
  ) {
    const documentocargadoresume = await this.findOne(id);
    try {
      if (!documentocargadoresume) {
        throw new NotFoundException('Documento cargado no encontrado');
      }
      await documentocargadoresume.updateOne(updateDocumentoscargadosresumeDto);
      return {
        ...documentocargadoresume.toJSON(),
        ...updateDocumentoscargadosresumeDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateImagen(id: string, filename: string) {
    const documentocargadoresume = await this.findOne(id);
    
    if (!documentocargadoresume) {
      throw new BadRequestException('Documento de operador no encontrado');
    }
    
    try {
      await documentocargadoresume.updateOne({ documento: filename });
      return {
        ...documentocargadoresume.toJSON(),
        documento: filename,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.documentoscargadosresumeModel.delete({ _id });
    return resp;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Documento cargado exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Documento cargado - Check server logs`,
    );
  }
}
