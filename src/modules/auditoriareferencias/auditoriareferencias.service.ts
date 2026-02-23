import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { Auditoriareferencias } from './entities/auditoriareferencias.entity';
import { CreateAuditoriareferenciasDto } from './dto/create-auditoriareferencias.dto';
import { UpdateAuditoriareferenciasDto } from './dto/update-auditoriareferencias.dto';
import { EstadoAuditoriaReferencia } from './entities/estado-auditoria-referencia.enum';
import { Referencias } from '../referencias/entities/referencias.entity';

@Injectable()
export class AuditoriareferenciasService {
  constructor(
    @InjectModel(Auditoriareferencias.name)
    private readonly auditoriaModel: ModelExt<Auditoriareferencias>,
    @InjectModel(Referencias.name)
    private readonly referenciasModel: ModelExt<Referencias>,
  ) {}

  async create(dto: CreateAuditoriareferenciasDto) {
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
            path: 'referencia_id',
            select: 'nombre_completo telefonos relacion',
            model: 'Referencias',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .select('-__v -deleted')
        .exec();

      return results.map((doc) => doc.toJSON());
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
            path: 'referencia_id',
            select: 'nombre_completo telefonos relacion',
            model: 'Referencias',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .exec();

      if (!result) return result;
      return result.toJSON();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByEstado(estado: EstadoAuditoriaReferencia) {
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
        if (result.referencia_id) {
          const referencia = await this.referenciasModel
            .findOne({ _id: result.referencia_id })
            .populate({
              path: 'resume_id',
              model: 'Resume',
              select:
                'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            })
            .populate({
              path: 'relacion',
              model: 'Tiporelaciones',
              select: 'nombre',
            })
            .lean()
            .exec();

          result.referencia_id = referencia as any;
        }
      }

      return results
        .map((json: any) => {
          const hasReferencia = json?.referencia_id;
          if (hasReferencia && !json.referencia_id.resume_id && json.resume_id) {
            json.referencia_id.resume_id = json.resume_id;
          }
          return json;
        })
        .filter(
          (json: any) =>
            json.referencia_id !== null &&
            json.resume_id !== null &&
            json.resume_id !== undefined,
        );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByEstadoAgrupado(estado: EstadoAuditoriaReferencia) {
    try {
      const referenciasConMaxUpdate = await this.auditoriaModel.aggregate([
        {
          $match: {
            deleted: false,
          },
        },
        {
          $group: {
            _id: '$referencia_id',
            maxUpdatedAt: { $max: '$updatedAt' },
          },
        },
      ]);

      const auditoriasRecientes = [] as any[];

      for (const referencia of referenciasConMaxUpdate) {
        const auditoriaMasReciente = await this.auditoriaModel
          .findOne({
            referencia_id: referencia._id,
            updatedAt: referencia.maxUpdatedAt,
            deleted: false,
          })
          .lean()
          .exec();

        if (auditoriaMasReciente) {
          auditoriasRecientes.push(auditoriaMasReciente);
        }
      }

      const auditoriasConEstado = auditoriasRecientes.filter(
        (aud: any) => aud.estado === estado,
      );

      const auditoriasConPopulates: any[] = [];

      for (const auditoria of auditoriasConEstado) {
        const resume = await this.auditoriaModel
          .findById(auditoria._id)
          .populate({
            path: 'resume_id',
            select:
              'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
            model: 'Resume',
          })
          .populate({
            path: 'auditor',
            select: 'nombre correo',
            model: 'Usuarios',
          })
          .lean()
          .exec();

        if (resume) {
          const auditoriaCompleta: any = {
            ...resume,
          };

          if (auditoria.referencia_id) {
            const referencia = await this.referenciasModel
              .findOne({ _id: auditoria.referencia_id })
              .populate({
                path: 'resume_id',
                model: 'Resume',
                select:
                  'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
              })
              .populate({
                path: 'relacion',
                model: 'Tiporelaciones',
                select: 'nombre',
              })
              .lean()
              .exec();

            if (referencia) {
              auditoriaCompleta.referencia_id = referencia as any;
              if (!referencia.resume_id && resume.resume_id) {
                auditoriaCompleta.referencia_id.resume_id = resume.resume_id;
              }
            }
          }

          auditoriasConPopulates.push(auditoriaCompleta);
        }
      }

      const auditoriasValidas = auditoriasConPopulates.filter(
        (auditoria) =>
          auditoria.referencia_id !== null &&
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
            referencias_auditoria: [],
          });
        }

        const resumeGroup = agrupado.get(resumeIdStr);
        resumeGroup.referencias_auditoria.push({
          _id: auditoria._id,
          referencia_id: auditoria.referencia_id,
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
        const dateA = a.referencias_auditoria[0]?.updatedAt || new Date(0);
        const dateB = b.referencias_auditoria[0]?.updatedAt || new Date(0);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, dto: UpdateAuditoriareferenciasDto) {
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

      if (updated && updated.referencia_id) {
        const referencia = await this.referenciasModel
          .findOne({ _id: updated.referencia_id })
          .populate({
            path: 'resume_id',
            model: 'Resume',
            select:
              'nombre apellido razonsocial numerodocumento telefono direccion fecha_nacimiento ubicacion tipodocumento sexo foto',
          })
          .populate({
            path: 'relacion',
            model: 'Tiporelaciones',
            select: 'nombre',
          })
          .lean()
          .exec();

        updated.referencia_id = referencia as any;
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

  async debugReferencia(referenciaId: string) {
    try {
      const auditorias = await this.auditoriaModel
        .find({
          referencia_id: referenciaId,
          deleted: false,
        })
        .sort({ updatedAt: -1 })
        .select('_id estado mensaje updatedAt createdAt')
        .lean()
        .exec();

      const agregacion = await this.auditoriaModel.aggregate([
        {
          $match: {
            referencia_id: new Types.ObjectId(referenciaId),
            deleted: false,
          },
        },
        {
          $group: {
            _id: '$referencia_id',
            maxUpdatedAt: { $max: '$updatedAt' },
            count: { $sum: 1 },
          },
        },
      ]);

      return {
        referencia_id: referenciaId,
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

