import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { Auditoriadocsvehiculo } from './entities/auditoriadocsvehiculo.entity';
import { CreateAuditoriadocsvehiculoDto } from './dto/create-auditoriadocsvehiculo.dto';
import { UpdateAuditoriadocsvehiculoDto } from './dto/update-auditoriadocsvehiculo.dto';
import { EstadoAuditoriaDocVehiculo } from './entities/estado-auditoria-vehiculo.enum';
import { Documentoscargadosvehiculo } from '../documentoscargadosvehiculo/entities/documentoscargadosvehiculo.entity';

@Injectable()
export class AuditoriadocsvehiculoService {
  constructor(
    @InjectModel(Auditoriadocsvehiculo.name)
    private readonly auditoriaModel: ModelExt<Auditoriadocsvehiculo>,
    @InjectModel(Documentoscargadosvehiculo.name)
    private readonly documentoModel: ModelExt<Documentoscargadosvehiculo>,
  ) {}

  async create(dto: CreateAuditoriadocsvehiculoDto) {
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
            path: 'resumevehiculo_id',
            select: 'placa modelo modelo_repotenciado',
            model: 'Resumevehiculo',
          },
          {
            path: 'documento_cargado_id',
            select: 'nombre documento estado_documento',
            model: 'Documentoscargadosvehiculo',
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
            path: 'resumevehiculo_id',
            select: 'placa modelo modelo_repotenciado',
            model: 'Resumevehiculo',
          },
          {
            path: 'documento_cargado_id',
            select: 'nombre documento estado_documento',
            model: 'Documentoscargadosvehiculo',
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

  async findByEstado(estado: EstadoAuditoriaDocVehiculo) {
    try {
      const results = await this.auditoriaModel
        .find({ deleted: false, estado })
        .populate([
          {
            path: 'resumevehiculo_id',
            select: 'placa modelo modelo_repotenciado color_id tipovehiculo_id clasevehiculo_id',
            model: 'Resumevehiculo',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      // Populate manual de documento_cargado_id ignorando soft-delete
      for (const result of results) {
        if (result.documento_cargado_id) {
          const documento = await this.documentoModel
            .findOne({ _id: result.documento_cargado_id })
            .populate({
              path: 'resumevehicle_id',
              model: 'Resumevehiculo',
              select: 'placa modelo modelo_repotenciado',
            })
            .lean()
            .exec();

          result.documento_cargado_id = documento as any;
          if (!documento) {
            throw new NotFoundException('Documento no encontrado');
          }
        }
      }

      // Completar documento_cargado_id.resumevehicle_id con el resume del documento de auditoría si viene nulo
      return results
        .map((json: any) => {
          const hasDocumentoCargado = json?.documento_cargado_id;
          const nestedResumeIsMissing =
            hasDocumentoCargado && !json.documento_cargado_id.resumevehicle_id;
          if (nestedResumeIsMissing && json?.resumevehiculo_id) {
            json.documento_cargado_id.resumevehicle_id = json.resumevehiculo_id;
          }
          // Incluir URL pública del documento cargado si está disponible
          if (json?.documento_cargado_id?.documento) {
            json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
          }
          return json;
        })
        .filter(
          (json: any) =>
            json.documento_cargado_id !== null &&
            json.resumevehiculo_id !== null &&
            json.resumevehiculo_id !== undefined,
        );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByVehiculo(resumevehiculoId: string) {
    try {
      const results = await this.auditoriaModel
        .find({ deleted: false, resumevehiculo_id: resumevehiculoId })
        .populate([
          { path: 'resumevehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
          { path: 'documento_cargado_id', select: 'nombre documento estado_documento', model: 'Documentoscargadosvehiculo' },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .lean()
        .exec();

      return results.map((json: any) => {
        if (json?.documento_cargado_id?.documento) {
          json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
        }
        return json;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByDocumento(documentoId: string) {
    try {
      const results = await this.auditoriaModel
        .find({ deleted: false, documento_cargado_id: documentoId })
        .populate([
          { path: 'resumevehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
          { path: 'documento_cargado_id', select: 'nombre documento estado_documento', model: 'Documentoscargadosvehiculo' },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .lean()
        .exec();

      return results.map((json: any) => {
        if (json?.documento_cargado_id?.documento) {
          json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
        }
        return json;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByAuditor(auditorId: string) {
    try {
      return await this.auditoriaModel
        .find({ deleted: false, auditor: auditorId })
        .populate([
          { path: 'resumevehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
          { path: 'documento_cargado_id', select: 'nombre documento estado_documento', model: 'Documentoscargadosvehiculo' },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .sort({ updatedAt: -1 })
        .lean();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByPlaca(placa: string) {
    try {
      const results = await this.auditoriaModel
        .find({ deleted: false })
        .populate([
          { path: 'resumevehiculo_id', match: { placa }, select: 'placa modelo', model: 'Resumevehiculo' },
          { path: 'documento_cargado_id', select: 'nombre documento estado_documento', model: 'Documentoscargadosvehiculo' },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .lean()
        .exec();

      const filtered = results.filter((r: any) => r.resumevehiculo_id);
      return filtered.map((json: any) => {
        if (json?.documento_cargado_id?.documento) {
          json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
        }
        return json;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByRangoFechas(fromIso: string, toIso: string) {
    try {
      const from = new Date(fromIso);
      const to = new Date(toIso);
      const results = await this.auditoriaModel
        .find({ deleted: false, updatedAt: { $gte: from, $lte: to } })
        .populate([
          { path: 'resumevehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
          { path: 'documento_cargado_id', select: 'nombre documento estado_documento', model: 'Documentoscargadosvehiculo' },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .sort({ updatedAt: -1 })
        .lean()
        .exec();

      return results.map((json: any) => {
        if (json?.documento_cargado_id?.documento) {
          json.documento_cargado_id.url = `${json.documento_cargado_id.documento}`;
        }
        return json;
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByEstadoAgrupado(estado: EstadoAuditoriaDocVehiculo) {
    try {
      // PASO 1: Usar agregación para encontrar el updatedAt más reciente de cada documento
      const documentosConMaxUpdate = await this.auditoriaModel.aggregate([
        { $match: { deleted: false } },
        { $group: { _id: '$documento_cargado_id', maxUpdatedAt: { $max: '$updatedAt' } } },
      ]);

      // PASO 2: Para cada documento, buscar la auditoría con ese updatedAt máximo
      const auditoriasRecientes = [] as any[];
      for (const doc of documentosConMaxUpdate) {
        const auditoriaMasReciente = await this.auditoriaModel
          .findOne({ documento_cargado_id: doc._id, updatedAt: doc.maxUpdatedAt, deleted: false })
          .lean()
          .exec();
        if (auditoriaMasReciente) auditoriasRecientes.push(auditoriaMasReciente);
      }

      // PASO 3: Filtrar solo las que tienen el estado solicitado
      const auditoriasConEstado = auditoriasRecientes.filter((aud: any) => aud.estado === estado);

      // PASO 4: Hacer los populates manualmente
      const auditoriasConPopulates = [] as any[];
      for (const auditoria of auditoriasConEstado) {
        // Populate resumevehiculo_id y auditor
        const auditoriaPopulate = await this.auditoriaModel
          .findById(auditoria._id)
          .populate({
            path: 'resumevehiculo_id',
            select: 'placa modelo modelo_repotenciado',
            model: 'Resumevehiculo',
          })
          .populate({ path: 'auditor', select: 'nombre correo', model: 'Usuarios' })
          .lean()
          .exec();

        if (auditoriaPopulate) {
          // Populate documento_cargado_id manualmente
          const documento = await this.documentoModel
            .findOne({ _id: auditoria.documento_cargado_id })
            .populate({
              path: 'resumevehicle_id',
              model: 'Resumevehiculo',
              select: 'placa modelo modelo_repotenciado',
            })
            .lean()
            .exec();

          const auditoriaCompleta: any = { ...auditoriaPopulate, documento_cargado_id: documento };

          // Agregar URL del documento
          if (documento?.documento) {
            auditoriaCompleta.documento_cargado_id.url = documento.documento;
          }

          // Completar resumevehicle_id del documento si falta
          if (documento && !documento.resumevehicle_id && auditoriaPopulate.resumevehiculo_id) {
            auditoriaCompleta.documento_cargado_id.resumevehicle_id = auditoriaPopulate.resumevehiculo_id;
          }

          auditoriasConPopulates.push(auditoriaCompleta);
        }
      }

      // PASO 5: Filtrar los que no tienen documento o resume válido
      const auditoriasValidas = auditoriasConPopulates.filter(
        (auditoria) =>
          auditoria.documento_cargado_id !== null &&
          auditoria.resumevehiculo_id !== null &&
          auditoria.resumevehiculo_id !== undefined,
      );

      // PASO 6: Agrupar por resumevehiculo_id
      const agrupado = new Map<string, any>();
      auditoriasValidas.forEach((auditoria) => {
        const resumeId = auditoria.resumevehiculo_id?._id || auditoria.resumevehiculo_id;
        const resumeIdStr = String(resumeId);
        if (!agrupado.has(resumeIdStr)) {
          const resumeData = auditoria.resumevehiculo_id;
          agrupado.set(resumeIdStr, {
            _id: resumeIdStr,
            placa: resumeData?.placa || '',
            modelo: resumeData?.modelo || '',
            modelo_repotenciado: resumeData?.modelo_repotenciado || '',
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
          status: auditoria.status,
          createdAt: auditoria.createdAt,
          updatedAt: auditoria.updatedAt,
        });
      });

      // PASO 7: Convertir el Map a array y ordenar
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

  async update(id: string, dto: UpdateAuditoriadocsvehiculoDto) {
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
            path: 'resumevehiculo_id',
            select: 'placa modelo modelo_repotenciado',
            model: 'Resumevehiculo',
          },
          { path: 'auditor', select: 'nombre correo', model: 'Usuarios' },
        ])
        .lean()
        .exec();

      if (updated && updated.documento_cargado_id) {
        const documento = await this.documentoModel
          .findOne({ _id: updated.documento_cargado_id })
          .populate({
            path: 'resumevehicle_id',
            model: 'Resumevehiculo',
            select: 'placa modelo modelo_repotenciado',
          })
          .lean()
          .exec();
        updated.documento_cargado_id = documento as any;
      }

      if (updated?.documento_cargado_id?.documento) {
        (updated.documento_cargado_id as any).url = `${(updated.documento_cargado_id as any).documento}`;
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
        { $match: { documento_cargado_id: new Types.ObjectId(documentoId), deleted: false } },
        { $group: { _id: '$documento_cargado_id', maxUpdatedAt: { $max: '$updatedAt' }, count: { $sum: 1 } } },
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
      throw new BadRequestException(`Registro ya existe: ${JSON.stringify(error.keyValue)}`);
    }
    // eslint-disable-next-line no-console
    console.log(error);
    throw new InternalServerErrorException('No se puede procesar la solicitud');
  }
}


