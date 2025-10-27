import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Documentos } from './entities/documentos.entity';
import { FindDocumentoDto } from './dto/find-documento.dto';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectModel(Documentos.name)
    private readonly documentosModel: ModelExt<Documentos>,
  ) {}
  async create(createDocumentoDto: CreateDocumentoDto) {
    try {
      const documento = await this.documentosModel.create(createDocumentoDto);
      return documento;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return this.documentosModel.find({}).select('-__v');
  }

  async findOne(id: string) {
    try {
      return await this.documentosModel.findById(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByGroupDocument(params: FindDocumentoDto) {
    try {
      const filter = {
        grupodocumento: new Types.ObjectId(params.grupodocumento),
      };
      const expiredDocuments = await this.documentosModel
        .find(filter)
        .select('-__v');
      return expiredDocuments;
      // return await this.documentosModel.find({
      //   grupodocumento: new Types.ObjectId(value),
      // });
      // .populate('entidad_id');
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateDocumentoDto: UpdateDocumentoDto) {
    const documento = await this.findOne(id);
    try {
      if (!documento) {
        throw new NotFoundException('Documento no encontrado');
      }
      await documento.updateOne(updateDocumentoDto);
      return { ...documento.toJSON(), ...updateDocumentoDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.documentosModel.delete({ _id });
    return resp;
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Documento exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Documento - Check server logs`,
    );
  }
}
