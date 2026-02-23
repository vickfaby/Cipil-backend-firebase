import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { Auditoriadocumentosenganche } from './entities/auditoriadocumentosenganche.entity';
import { CreateAuditoriadocumentosengancheDto } from './dto/create-auditoriadocumentosenganche.dto';
import { UpdateAuditoriadocumentosengancheDto } from './dto/update-auditoriadocumentosenganche.dto';
import { EstadoAuditoriaDocumentosEnganche } from './entities/estado-auditoria-documentosenganche.enum';
import { Documentoscargadosresume } from '../documentoscargadosresume/entities/documentoscargadosresume.entity';

@Injectable()
export class AuditoriadocumentosengancheService {
  constructor(
    @InjectModel(Auditoriadocumentosenganche.name)
    private readonly auditoriaModel: ModelExt<Auditoriadocumentosenganche>,
    @InjectModel(Documentoscargadosresume.name)
    private readonly documentoModel: ModelExt<Documentoscargadosresume>,
  ) {}

  async create(dto: CreateAuditoriadocumentosengancheDto) {
    try {
      return await this.auditoriaModel.create(dto);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      const results = await this.auditoriaModel
        .find({ deleted: false })
        .populate([
          {
            path: 'resume_id',
            select: 'nombre apellido razonsocial',
            model: 'Resume',
          },
          {
            path: 'documento_cargado_id',
            select: 'nombre documento estado_documento',
            model: 'Documentoscargadosresume',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .select('-__v -deleted')
        .exec();

      return results.map((doc) => {
        const json: any = doc.toJSON();
        if (json?.documento_cargado_id?.documento) {
          json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
        }
        return json;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.auditoriaModel
        .findById(id)
        .populate([
          {
            path: 'resume_id',
            select: 'nombre apellido razonsocial',
            model: 'Resume',
          },
          {
            path: 'documento_cargado_id',
            select: 'nombre documento estado_documento',
            model: 'Documentoscargadosresume',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .exec();

      if (!result) return result;

      const json: any = result.toJSON();
      if (json?.documento_cargado_id?.documento) {
        json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
      }
      return json;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByEstado(estado: EstadoAuditoriaDocumentosEnganche) {
    try {
      const results = await this.auditoriaModel
        .find({ deleted: false, estado })
        .populate([
          {
            path: 'resume_id',
            select:
              'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            model: 'Resume',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      for (const result of results) {
        if (result.documento_cargado_id) {
          const documento = await this.documentoModel
            .findOne({ _id: result.documento_cargado_id })
            .populate({
              path: 'resume_id',
              model: 'Resume',
              select:
                'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            })
            .lean()
            .exec();

          result.documento_cargado_id = documento as any;
          if (!documento) {
            throw new NotFoundException('Documento no encontrado');
          }
        }
      }

      return results
        .map((json: any) => {
          const hasDocumentoCargado = json?.documento_cargado_id;
          const nestedResumeIsMissing =
            hasDocumentoCargado && !json.documento_cargado_id.resume_id;
          if (nestedResumeIsMissing && json?.resume_id) {
            json.documento_cargado_id.resume_id = json.resume_id;
          }
          if (json?.documento_cargado_id?.documento) {
            json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
          }
          return json;
        })
        .filter(
          (json: any) =>
            json.documento_cargado_id !== null &&
            json.resume_id !== null &&
            json.resume_id !== undefined,
        );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByEstadoAgrupado(estado: EstadoAuditoriaDocumentosEnganche) {
    try {
      const documentosConMaxUpdate = await this.auditoriaModel.aggregate([
        { $match: { deleted: false } },
        {
          $group: {
            _id: '$documento_cargado_id',
            maxUpdatedAt: { $max: '$updatedAt' },
          },
        },
      ]);

      const auditoriasRecientes = [] as any[];
      for (const doc of documentosConMaxUpdate) {
        const auditoriaMasReciente = await this.auditoriaModel
          .findOne({
            documento_cargado_id: doc._id,
            updatedAt: doc.maxUpdatedAt,
            deleted: false,
          })
          .lean()
          .exec();
        if (auditoriaMasReciente) auditoriasRecientes.push(auditoriaMasReciente);
      }

      const auditoriasConEstado = auditoriasRecientes.filter(
        (aud: any) => aud.estado === estado,
      );

      const auditoriasConPopulates: any[] = [];
      for (const auditoria of auditoriasConEstado) {
        const auditoriaPopulate = await this.auditoriaModel
          .findById(auditoria._id)
          .populate({
            path: 'resume_id',
            select:
              'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            model: 'Resume',
          })
          .populate({ path: 'auditor', select: 'nombre correo', model: 'Usuarios' })
          .lean()
          .exec();

        if (auditoriaPopulate) {
          const documento = await this.documentoModel
            .findOne({ _id: auditoria.documento_cargado_id })
            .populate({
              path: 'resume_id',
              model: 'Resume',
              select:
                'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            })
            .lean()
            .exec();

          const auditoriaCompleta: any = {
            ...auditoriaPopulate,
            documento_cargado_id: documento,
          };

          if (documento?.documento) {
            auditoriaCompleta.documento_cargado_id.url = documento.documento;
          }

          if (documento && !documento.resume_id && auditoriaPopulate.resume_id) {
            auditoriaCompleta.documento_cargado_id.resume_id =
              auditoriaPopulate.resume_id;
          }

          auditoriasConPopulates.push(auditoriaCompleta);
        }
      }

      const auditoriasValidas = auditoriasConPopulates.filter(
        (auditoria) =>
          auditoria.documento_cargado_id !== null &&
          auditoria.resume_id !== null &&
          auditoria.resume_id !== undefined,
      );

      const agrupado = new Map<string, any>();
      auditoriasValidas.forEach((auditoria) => {
        const resumeId = auditoria.resume_id?._id || auditoria.resume_id;
        const resumeIdStr = String(resumeId);
        if (!agrupado.has(resumeIdStr)) {
          const resumeData = auditoria.resume_id;
          agrupado.set(resumeIdStr, {
            _id: resumeIdStr,
            nombre: resumeData?.nombre || '',
            apellido: resumeData?.apellido || '',
            razonsocial: resumeData?.razonsocial || '',
            numerodocumento: resumeData?.numerodocumento || null,
            telefono: resumeData?.telefono || null,
            direccion: resumeData?.direccion || '',
            fecha_nacimiento: resumeData?.fecha_nacimiento || null,
            ubicacion: resumeData?.ubicacion || '',
            foto: resumeData?.foto || null,
            tipodocumento: resumeData?.tipodocumento || null,
            sexo: resumeData?.sexo || null,
            documentos_auditoria: [],
          });
        }
        const resumeGroup = agrupado.get(resumeIdStr);
        resumeGroup.documentos_auditoria.push({
          _id: auditoria._id,
          documento_cargado_id: auditoria.documento_cargado_id,
          auditor: auditoria.auditor,
          estado: auditoria.estado,
          mensaje: auditoria.mensaje,
          verificado: auditoria.verificado,
          status: auditoria.status,
          createdAt: auditoria.createdAt,
          updatedAt: auditoria.updatedAt,
        });
      });

      const resultado = Array.from(agrupado.values());
      return resultado.sort((a, b) => {
        const dateA = a.documentos_auditoria[0]?.updatedAt || new Date(0);
        const dateB = b.documentos_auditoria[0]?.updatedAt || new Date(0);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateAuditoriadocumentosengancheDto) {
    try {
      const doc = await this.auditoriaModel.findById(id);
      if (!doc) {
        throw new BadRequestException('Auditoría no encontrada');
      }

      await doc.updateOne(dto);

      const updated = await this.auditoriaModel
        .findById(id)
        .populate([
          {
            path: 'resume_id',
            select:
              'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            model: 'Resume',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .lean()
        .exec();

      if (updated && updated.documento_cargado_id) {
        const documento = await this.documentoModel
          .findOne({ _id: updated.documento_cargado_id })
          .populate({
            path: 'resume_id',
            model: 'Resume',
            select:
              'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
          })
          .lean()
          .exec();
        updated.documento_cargado_id = documento as any;
      }

      if (updated?.documento_cargado_id?.documento) {
        (updated.documento_cargado_id as any).url =
          `${(updated.documento_cargado_id as any).documento}`;
      }

      return updated;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    return this.auditoriaModel.delete({ _id });
  }

  async debugDocumento(documentoId: string) {
    try {
      const auditorias = await this.auditoriaModel
        .find({ documento_cargado_id: documentoId, deleted: false })
        .sort({ updatedAt: -1 })
        .select('_id estado mensaje updatedAt createdAt')
        .lean()
        .exec();

      const agregacion = await this.auditoriaModel.aggregate([
        {
          $match: {
            documento_cargado_id: new Types.ObjectId(documentoId),
            deleted: false,
          },
        },
        {
          $group: {
            _id: '$documento_cargado_id',
            maxUpdatedAt: { $max: '$updatedAt' },
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        documento_cargado_id: documentoId,
        total_auditorias: auditorias.length,
        auditorias_ordenadas_por_updatedAt: auditorias,
        agregacion_max_updatedAt: agregacion,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error?.code === 11000) {
      throw new BadRequestException(
        `Registro ya existe: ${JSON.stringify(error.keyValue)}`,
      );
    }
    // eslint-disable-next-line no-console
    console.log(error);
    throw new InternalServerErrorException('No se puede procesar la solicitud');
  }
}

