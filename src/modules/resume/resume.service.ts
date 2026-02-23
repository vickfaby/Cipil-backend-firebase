import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';
import * as fs from 'fs';
import * as path from 'path';

import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume } from './entities/resume.entity';
import { SeguridadsocialesService } from '../seguridadsociales/seguridadsociales.service';
import { ReferenciasService } from '../referencias/referencias.service';
import { DocumentoscargadosresumeService } from '../documentoscargadosresume/documentoscargadosresume.service';
import { GetResumePDFDto } from './dto/get-resume-pdf.dto';
import { generatePDF } from 'src/common/utils/generatepdf.handle';
import { CountriesService } from '../countries/countries.service';
import { StatesService } from '../states/states.service';
import { CitiesService } from '../cities/cities.service';
import { LogimpresionesService } from '../logimpresiones/logimpresiones.service';
import { Auditoriadocsoperador } from '../auditoriadocsoperador/entities/auditoriadocsoperador.entity';
import { Posiciondisponible } from '../posicion_disponible/entities/posicion_disponible.entity';
import { Auditoriareferencias } from '../auditoriareferencias/entities/auditoriareferencias.entity';

type FirstResumeBasic = {
  _id?: string;
  pais?: number;
  estado?: number;
  ciudad?: number;
  foto?: string;
  tipodocumento?: { nombre_tipodocumento?: string };
  numerodocumento?: number | string;
  categoria_id?: { nombre_categoria?: string };
  tipotercero_id?: unknown;
  tipopersona?: { nombre_tipopersona?: string };
  razonsocial?: string;
  nombre?: string;
  apellido?: string;
  sexo?: { nombre_sexo?: string };
  telefono?: string | number;
  direccion?: string;
  ubicacion?: string;
  fecha_nacimiento?: string | number | Date;
  calificacion?: string | number;
};

@Injectable()
export class ResumeService {
  private toNumber(value: unknown, fallback: number): number {
    const n =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value)
          : NaN;
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  constructor(
    @InjectModel(Resume.name)
    private readonly resumeModel: ModelExt<Resume>,
    @InjectModel(Auditoriadocsoperador.name)
    private readonly auditoriaModel: ModelExt<Auditoriadocsoperador>,
    @InjectModel(Auditoriareferencias.name)
    private readonly auditoriaReferenciasModel: ModelExt<Auditoriareferencias>,
    @InjectModel(Posiciondisponible.name)
    private readonly posicionDisponibleModel: ModelExt<Posiciondisponible>,
    private readonly seguridadsocialService: SeguridadsocialesService,
    private readonly referenciasService: ReferenciasService,
    private readonly documentoscargadosresumeService: DocumentoscargadosresumeService,
    private readonly coutriesModel: CountriesService,
    private readonly statesModel: StatesService,
    private readonly citiesModel: CitiesService,
    private readonly logImpresionesModel: LogimpresionesService,
  ) {}
  async create(createResumeDto: CreateResumeDto) {
    //TODO: REFEACTORIZAR AGREGAR BUSQUEDA POR TYPO DE DOCUMENTO Y NUMERO DE CEDULA
    try {
      const resume = await this.resumeModel.create(createResumeDto);
      return resume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(pagination: { limit?: number | string; page?: number | string }) {
    //return this.resumeModel.find({}).select('-__v');
    const result = await this.resumeModel.paginate({}, pagination);
    const docs = await this._attachLastPosition(result.docs);
    return {
      ...result,
      docs,
    };
  }

  async findAllNotByUser(
    userId: string,
    pagination: { limit?: number | string; page?: number | string },
  ) {
    try {
      const filter = { user_id: { $ne: userId } };
      const limit = this.toNumber(pagination?.limit, 10);
      const page = this.toNumber(pagination?.page, 1);
      const skip = (page - 1) * limit;

      const [docs, totalDocs] = await Promise.all([
        this.resumeModel
          .find(filter)
          .populate({
            path: 'user_id',
            select: 'nombre correo foto _id roles_id',
            populate: {
              path: 'roles_id',
              select: 'nombre _id',
            },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.resumeModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalDocs / limit) || 1;

      // Transformar docs: renombrar user_id a usuario_creador
      const transformedDocs = (docs as Array<Record<string, unknown>>).map(
        (doc) => {
          const { user_id, ...rest } = doc as Record<string, unknown> & {
            user_id?: unknown;
          };
          return {
            ...rest,
            usuario_creador: user_id ?? null,
          } as Record<string, unknown>;
        },
      );

      const docsWithPos = await this._attachLastPosition(transformedDocs);

      return {
        docs: docsWithPos,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: skip + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAllNotByUserWithSearch(
    userId: string,
    text: string,
    pagination: { limit?: number | string; page?: number | string },
  ) {
    try {
      const baseFilter: Record<string, unknown> = { user_id: { $ne: userId } };
      const trimmedText = (text || '').trim();
      const filter = trimmedText
        ? {
            ...baseFilter,
            $or: [
              { nombre: { $regex: trimmedText, $options: 'i' } },
              { apellido: { $regex: trimmedText, $options: 'i' } },
            ],
          }
        : baseFilter;

      const limit = this.toNumber(pagination?.limit, 10);
      const page = this.toNumber(pagination?.page, 1);
      const skip = (page - 1) * limit;

      const [docs, totalDocs] = await Promise.all([
        this.resumeModel
          .find(filter)
          .populate({
            path: 'user_id',
            select: 'nombre correo foto _id roles_id',
            populate: {
              path: 'roles_id',
              select: 'nombre _id',
            },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.resumeModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalDocs / limit) || 1;

      // Transformar docs: renombrar user_id a usuario_creador
      const transformedDocs = (docs as Array<Record<string, unknown>>).map(
        (doc) => {
          const { user_id, ...rest } = doc as Record<string, unknown> & {
            user_id?: unknown;
          };
          return {
            ...rest,
            usuario_creador: user_id ?? null,
          } as Record<string, unknown>;
        },
      );

      const docsWithPos = await this._attachLastPosition(transformedDocs);

      return {
        docs: docsWithPos,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: skip + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const doc = await this.resumeModel
        .findById(id)
        .populate({
          path: 'entidades_seguridad_social',
          select:
            'tipoentidad_id grupoentidad_id fecha_afiliacion estado_afiliacion observaciones resume_id user_id status estado_documento documento _id',
        })
        .populate([
          {
            path: 'referencias',
            select:
              'nombre_completo telefonos pais_referencia estado_referencia ciudad_referencia direccion relacion _id',
          },
        ])
        .populate([
          {
            path: 'documentos',
            select:
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento estado_documento _id',
          },
        ]);
      if (!doc) return null;
      const [docWithPos] = await this._attachLastPosition([doc]);
      return docWithPos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOneWithLatestAudits(id: string) {
    try {
      // Obtener el resume con todos los populates
      const resume = await this.resumeModel
        .findById(id)
        .populate({
          path: 'entidades_seguridad_social',
          select:
            'tipoentidad_id grupoentidad_id fecha_afiliacion estado_afiliacion observaciones resume_id user_id status estado_documento documento _id',
        })
        .populate([
          {
            path: 'referencias',
            select:
              'nombre_completo telefonos pais_referencia estado_referencia ciudad_referencia direccion relacion _id',
          },
        ])
        .populate([
          {
            path: 'documentos',
            select:
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento estado_documento _id',
          },
        ])
        .lean();

      if (!resume) {
        return null;
      }

      // Normalizar entidades de seguridad social para asegurar que el campo documento siempre esté presente
      const entidadesSeguridadSocial = (resume.entidades_seguridad_social ||
        []) as any[];
      let entidadesNormalizadas = entidadesSeguridadSocial.map((entidad: any) => ({
        ...entidad,
        documento: entidad.documento || null,
        estado_documento: entidad.estado_documento ?? 0,
      }));

      // Para cada entidad de seguridad social, obtener la auditoría más reciente
      if (entidadesNormalizadas.length > 0) {
        entidadesNormalizadas = await Promise.all(
          entidadesNormalizadas.map(async (entidad: any) => {
            const auditoriaReciente = await this.auditoriaModel
              .findOne({
                seguridad_social_id: entidad._id,
                deleted: false,
              })
              .populate({
                path: 'auditor',
                select: 'nombre correo _id',
                model: 'Usuarios',
              })
              .sort({ createdAt: -1 })
              .select('-__v -deleted')
              .lean();

            return {
              ...entidad,
              ultima_auditoria: auditoriaReciente || null,
            };
          }),
        );
      }

      // Para cada documento, obtener la auditoría más reciente
      let documentosConAuditoria: any[] = (resume.documentos || []) as any[];
      if (resume.documentos && resume.documentos.length > 0) {
        documentosConAuditoria = await Promise.all(
          (resume.documentos as any[]).map(async (documento: any) => {
            // Buscar la auditoría más reciente para este documento
            const auditoriaReciente = await this.auditoriaModel
              .findOne({
                documento_cargado_id: documento._id,
                deleted: false,
              })
              .populate({
                path: 'auditor',
                select: 'nombre correo _id',
                model: 'Usuarios',
              })
              .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
              .select('-__v -deleted')
              .lean();

            return {
              ...documento,
              ultima_auditoria: auditoriaReciente || null,
            };
          }),
        );
      }

      // Para cada referencia, obtener la auditoría más reciente
      let referenciasConAuditoria: any[] = (resume.referencias || []) as any[];
      if (resume.referencias && resume.referencias.length > 0) {
        referenciasConAuditoria = await Promise.all(
          (resume.referencias as any[]).map(async (referencia: any) => {
            const auditoriaReciente = await this.auditoriaReferenciasModel
              .findOne({
                referencia_id: referencia._id,
                deleted: false,
              })
              .populate({
                path: 'auditor',
                select: 'nombre correo _id',
                model: 'Usuarios',
              })
              .sort({ createdAt: -1 })
              .select('-__v -deleted')
              .lean();

            return {
              ...referencia,
              ultima_auditoria: auditoriaReciente || null,
            };
          }),
        );
      }

      const resumeWithDocs = {
        ...(resume as Record<string, unknown>),
        entidades_seguridad_social: entidadesNormalizadas,
        referencias: referenciasConAuditoria,
        documentos: documentosConAuditoria,
      } as Record<string, unknown>;

      const [resumeWithPos] = await this._attachLastPosition([resumeWithDocs]);
      return resumeWithPos;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByDocument(numero: string) {
    try {
      const docs = await this.resumeModel
        .find({ numerodocumento: numero })
        .select(
          '-foto -tipodocumento -categoria_id -tipotercero_id -tipopersona -sexo -telefono -direccion -pais -estado -ciudad -ubicacion -fecha_nacimiento -calificacion -progreso -entidades_seguridad_social -referencias -documentos -user_id -_id -status -__v',
        );
      return this._attachLastPosition(docs);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuarioEmpresa(
    usuarioEmpresaId: string,
    pagination: { limit?: number | string; page?: number | string },
  ) {
    try {
      const filter = {
        usuario_empresa_id: {
          $exists: true,
          $eq: usuarioEmpresaId,
        },
      };
      const result = await this.resumeModel.paginate(filter, pagination);
      const docs = await this._attachLastPosition(result.docs);
      return { ...result, docs };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuarioEmpresaWithSearch(
    usuarioEmpresaId: string,
    text: string,
    pagination: { limit?: number | string; page?: number | string },
  ) {
    try {
      const baseFilter = {
        usuario_empresa_id: {
          $exists: true,
          $eq: usuarioEmpresaId,
        },
      };
      const trimmedText = (text || '').trim();
      const filter = trimmedText
        ? {
            ...baseFilter,
            $or: [
              { nombre: { $regex: trimmedText, $options: 'i' } },
              { apellido: { $regex: trimmedText, $options: 'i' } },
            ],
          }
        : baseFilter;

      const result = await this.resumeModel.paginate(filter, pagination);
      const docs = await this._attachLastPosition(result.docs);
      return { ...result, docs };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuarioOperador(
    usuarioOperadorId: string,
    pagination: { limit?: number | string; page?: number | string },
  ) {
    try {
      const filter = {
        usuario_operador_id: {
          $exists: true,
          $eq: usuarioOperadorId,
        },
      };
      const result = await this.resumeModel.paginate(filter, pagination);
      const docs = await this._attachLastPosition(result.docs);
      return { ...result, docs };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateResumeDto: UpdateResumeDto) {
    const resume = await this.findOne(id);

    try {
      console.log('========== INICIO UPDATE RESUME ==========');
      console.log('Resume ID:', id);
      if (!resume) {
        throw new BadRequestException('Resume not found');
      }
      // Logs omitidos para evitar asignaciones inseguras

      // NUEVO: Procesar subdocumentos manteniendo IDs existentes
      const resumeRecord = resume as unknown as { [k: string]: unknown };
      let respSeguro: unknown = resumeRecord?.entidades_seguridad_social;
      let respRferencia: unknown = resumeRecord?.referencias;
      let respDocumentoscargadosresume: unknown = resumeRecord?.documentos;

      // Procesar entidades de seguridad social
      if (updateResumeDto?.entidades_seguridad_social) {
        console.log('📋 Procesando entidades de seguridad social...');
        respSeguro =
          await this.seguridadsocialService.updateManySeguridadSocialPreservingIds(
            updateResumeDto.entidades_seguridad_social,
            resume.entidades_seguridad_social,
          );
      }

      // Procesar referencias
      if (updateResumeDto?.referencias) {
        console.log('📋 Procesando referencias...');
        respRferencia =
          await this.referenciasService.updateManyReferenciaPreservingIds(
            updateResumeDto.referencias,
            resume.referencias,
          );
      }

      // Procesar documentos cargados
      if (updateResumeDto?.documentos) {
        console.log('📋 Procesando documentos cargados...');
        respDocumentoscargadosresume =
          await this.documentoscargadosresumeService.updateManyDocumentoscargadosresumePreservingIds(
            updateResumeDto.documentos,
            resume.documentos,
          );
      }

      // Log posterior omitido

      // Actualizar campos simples
      const simpleFields = [
        'foto',
        'tipodocumento',
        'numerodocumento',
        'categoria_id',
        'tipotercero_id',
        'tipopersona',
        'razonsocial',
        'nombre',
        'apellido',
        'sexo',
        'telefono',
        'direccion',
        'pais',
        'estado',
        'ciudad',
        'ubicacion',
        'fecha_nacimiento',
        'calificacion',
        'progreso',
        'status',
      ];

      const updateData: Record<string, unknown> = {
        entidades_seguridad_social: respSeguro,
        referencias: respRferencia,
        documentos: respDocumentoscargadosresume,
      };

      simpleFields.forEach((field) => {
        if (updateResumeDto[field] !== undefined) {
          updateData[field] = updateResumeDto[field];
        }
      });

      // `resume` proviene de `findOne()` que usa `_attachLastPosition()` y retorna un objeto plano,
      // por lo que no tiene métodos de documento Mongoose (p.ej. `updateOne`).
      await this.resumeModel.updateOne({ _id: id }, updateData);

      // Consultar el resume actualizado con todos los populates
      const updatedResume = await this.resumeModel
        .findById(id)
        .populate({
          path: 'entidades_seguridad_social',
          select:
            'tipoentidad_id grupoentidad_id fecha_afiliacion estado_afiliacion observaciones resume_id user_id status estado_documento documento _id',
        })
        .populate([
          {
            path: 'referencias',
            select:
              'nombre_completo telefonos pais_referencia estado_referencia ciudad_referencia direccion relacion _id',
          },
        ])
        .populate([
          {
            path: 'documentos',
            select:
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento estado_documento _id',
          },
        ]);

      return updatedResume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async setDisponible(id: string, disponible: boolean) {
    const resume = await this.resumeModel.findById(id);
    if (!resume) {
      throw new BadRequestException('Resume not found');
    }
    resume.disponible = disponible;
    return resume.save();
  }

  remove(id: string) {
    //TODO: ADD SEGSOCIAL, REFERENCIAS, DOCUMENTOS CARGADOS RESUMEN
    const _id = new Types.ObjectId(id);
    return this.resumeModel.delete({ _id });
  }
  async getResumeByDocument(typedoc: string, numdoc: number) {
    try {
      return await this.resumeModel
        .find({
          tipodocumento: typedoc,
          numerodocumento: numdoc,
          deleted: false,
        })
        .populate({
          path: 'tipodocumento',
          select: { _id: 0, nombre_tipodocumento: 1 },
        })
        .populate({
          path: 'categoria_id',
          select: { _id: 0, nombre_categoria: 1 },
        })
        .populate({
          path: 'tipotercero_id',
          select: { _id: 0, nombre_tipousuario: 1 },
        })
        .populate({
          path: 'tipopersona',
          select: { _id: 0, nombre_tipopersona: 1 },
        })
        .populate({
          path: 'sexo',
          select: { _id: 0, nombre_sexo: 1 },
        })
        .select(
          '-progreso -entidades_seguridad_social -referencias -documentos -status -deleted -createdAt -updatedAt -__v',
        );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async generatePDFFile({
    typedoc,
    numdoc,
    typepdf,
    typehead,
  }: GetResumePDFDto) {
    type EntidadItem = {
      estado_afiliacion?: boolean;
      fecha_afiliacion?: string;
      grupoentidad_id?: string;
      observaciones?: string;
      tipoentidad_id?: string;
    };
    type ReferenciaItem = {
      relacion?: string;
      nombre_completo?: string;
      telefonos?: string[];
      pais_referencia?: string;
      estado_referencia?: string;
      ciudad_referencia?: string;
      direccion?: string;
    };
    type DocumentoItem = {
      documento?: string;
      grupodocumento_id?: any;
      documento_id?: any;
      fecha_expedicion?: string | number | Date;
      fecha_vencimiento?: string | number | Date;
      categoria?: string;
      codigo_referencia?: string;
      entidad_emisora?: any;
      estado_documento?: number;
      observaciones?: string;
    };

    const datresume = await this.getResumeByDocument(typedoc, Number(numdoc));
    const firstResume = Array.isArray(datresume)
      ? (datresume[0] as FirstResumeBasic)
      : undefined;
    if (!firstResume) {
      throw new BadRequestException('No se encontró el resumen');
    }
    const resumeId = firstResume._id as string;

    const entsegsoc = await this.seguridadsocialService.findByResume(resumeId);
    const dataentidadesObj = (entsegsoc ?? {}) as Record<string, EntidadItem>;
    const list = Object.values(dataentidadesObj).map((item) => ({
      estado_afiliacion: item.estado_afiliacion ? 'Activo' : 'Inactivo',
      fecha_afiliacion: item.fecha_afiliacion ?? '',
      grupoentidad_id: item.grupoentidad_id ?? '',
      observaciones: item.observaciones ?? '',
      tipoentidad_id: item.tipoentidad_id ?? '',
    }));

    const refresume = await this.referenciasService.findByResume(resumeId);
    const listref = (refresume ?? []).map((item) => {
      const r = item as unknown as ReferenciaItem;
      return {
        relacion: r.relacion ?? '',
        nombre_completo: r.nombre_completo ?? '',
        telefonos: Array.isArray(r.telefonos) ? r.telefonos : [],
        pais_referencia: r.pais_referencia ?? '',
        estado_referencia: r.estado_referencia ?? '',
        ciudad_referencia: r.ciudad_referencia ?? '',
        direccion: r.direccion ?? '',
      };
    });

    const docresume =
      await this.documentoscargadosresumeService.findByResume(resumeId);
    const listdocs = (docresume ?? []).map((item) => {
      const d = item as unknown as DocumentoItem;
      const fileName = typeof d.documento === 'string' ? d.documento : '';
      const foto = fs.readFileSync(
        path.join(process.cwd(), `./public/uploads/${fileName}`),
        {
          encoding: 'base64',
        },
      );
      const fechaVencimientoDate = new Date(d.fecha_vencimiento ?? 0);
      const isExpired = fechaVencimientoDate.getTime() < Date.now();
      const out: {
        documento: string;
        grupodocumento_id?: unknown;
        documento_id?: unknown;
        fecha_expedicion: string;
        fecha_vencimiento: string;
        is_expired: boolean;
        categoria: string;
        codigo_referencia: string;
        entidad_emisora?: unknown;
        estado_documento: number;
        observaciones: string;
      } = {
        documento: foto,
        grupodocumento_id: d.grupodocumento_id as unknown,
        documento_id: d.documento_id as unknown,
        fecha_expedicion: new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(d.fecha_expedicion ?? 0)),
        fecha_vencimiento: new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(fechaVencimientoDate),
        is_expired: isExpired,
        categoria: d.categoria ?? '',
        codigo_referencia: d.codigo_referencia ?? '',
        entidad_emisora: d.entidad_emisora as unknown,
        estado_documento:
          typeof d.estado_documento === 'number' ? d.estado_documento : 0,
        observaciones: d.observaciones ?? '',
      };
      return out;
    });

    const paisbasicdata =
      (await this.coutriesModel.findById(String(firstResume.pais ?? ''))) || [];
    const statebasicdata =
      (await this.statesModel.findBynumber(String(firstResume.estado ?? ''))) ||
      [];
    const citybasicdata =
      (await this.citiesModel.findBynumber(String(firstResume.ciudad ?? ''))) ||
      [];
    //TODO: Guardar fecha de impresión
    const fechaActual = Date.now();
    const dataFecha = {
      _id: new mongoose.Types.ObjectId().toString(),
      resume_id: String(firstResume._id ?? ''),
      fecha_impresion: new Date(fechaActual),
      __v: '0',
      resumevehiculo_id: '',
    };
    const fechaImp = await this.logImpresionesModel.create(dataFecha);
    const fechaImpDate = fechaImp?.fecha_impresion ?? new Date();
    //TODO: Mostrar fecha ultimo estudio de seguridad
    let festudio: string | undefined;
    const estudioSeg = Object.values(listdocs)
      .filter((item) => {
        const docId = (
          item as { documento_id?: { nombre_documento?: string } | string }
        )?.documento_id;
        return (
          docId !== undefined &&
          typeof docId !== 'string' &&
          (docId as { nombre_documento?: string })?.nombre_documento ===
            'ESTUDIO DE SEGURIDAD COMPLETO'
        );
      })
      .map((r) => {
        const fv = (r as { fecha_vencimiento?: string })?.fecha_vencimiento;
        return { fecha_vencimiento: fv };
      });
    if (estudioSeg !== undefined) {
      festudio = estudioSeg[0].fecha_vencimiento;
    }
    //show image
    const fotoNombre = String(firstResume.foto ?? '');
    const fotouploads = fs.readFileSync(
      path.join(process.cwd(), `./public/uploads/${fotoNombre}`),
      {
        encoding: 'base64',
      },
    );
    const marcaagua = fs.readFileSync(
      path.join(process.cwd(), `./public/uploads/marca.png`),
      { encoding: 'base64' },
    );
    const code = `${firstResume?._id}`;
    const codigoFinal = `HVC-` + code.slice(0, 8);
    //data resume for pdf;
    const data: any = {
      basic: {
        foto: fotouploads,
        codigo: codigoFinal,
        tipodocumento: firstResume?.tipodocumento?.nombre_tipodocumento,
        numerodocumento: firstResume?.numerodocumento,
        categoria_id: firstResume?.categoria_id?.nombre_categoria,
        tipotercero_id: firstResume?.tipotercero_id,
        tipopersona: firstResume?.tipopersona?.nombre_tipopersona,
        razonsocial: firstResume?.razonsocial,
        nombre: firstResume?.nombre,
        apellido: firstResume?.apellido,
        sexo: firstResume?.sexo?.nombre_sexo,
        telefono: firstResume?.telefono,
        direccion: firstResume?.direccion,
        pais: paisbasicdata[0]?.name,
        estado: statebasicdata[0]?.name,
        ciudad: citybasicdata[0]?.name,
        ubicacion: firstResume?.ubicacion,
        fecha_nacimiento: new Intl.DateTimeFormat('en-ES').format(
          new Date(firstResume?.fecha_nacimiento ?? 0),
        ),
        calificacion: firstResume?.calificacion,
      },
      marcaagua: marcaagua,
      entidades: list,
      referencias: listref,
      documentos: listdocs,
      type: Number(typepdf),
      head: Number(typehead),
      fechaimpresion: new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(fechaImpDate)),
      fecha_estudio: festudio ?? '',
    };
    //console.log('🚀 ~ data:', data.basic);
    const pdf = await generatePDF(data);
    return pdf;
  }

  private handleExceptions(error: unknown) {
    const err = error as { code?: number; keyValue?: unknown } | undefined;
    if (err && err.code === 11000) {
      throw new BadRequestException(
        `Resume exists in db ${JSON.stringify(err.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Resume - Check server logs`,
    );
  }

  private async _attachLastPosition(docs: any[]) {
    if (!docs || docs.length === 0) return docs;
    const ids = docs.map((d) =>
      d._id instanceof mongoose.Types.ObjectId
        ? d._id
        : new mongoose.Types.ObjectId(d._id),
    );

    const posiciones = await this.posicionDisponibleModel.aggregate([
      { $match: { resume_id: { $in: ids } } },
      { $sort: { fecha_creacion: -1 } },
      {
        $group: {
          _id: '$resume_id',
          doc: { $first: '$$ROOT' },
        },
      },
    ]);

    const posMap = new Map();
    posiciones.forEach((p) => {
      if (p._id) posMap.set(p._id.toString(), p.doc);
    });

    return docs.map((doc) => {
      const docObj =
        doc && typeof doc.toObject === 'function' ? doc.toObject() : doc;
      const idStr = docObj._id ? docObj._id.toString() : '';
      return {
        ...docObj,
        ultima_posicion: posMap.get(idStr) || null,
      };
    });
  }
}
