import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';
import fs = require('fs');
import path = require('path');

import { CreateResumevehiculoDto } from './dto/create-resumevehiculo.dto';
import { UpdateResumevehiculoDto } from './dto/update-resumevehiculo.dto';
import { Resumevehiculo } from './entities/resumevehiculo.entity';
import { DocumentoscargadosvehiculoService } from '../documentoscargadosvehiculo/documentoscargadosvehiculo.service';
import { DocumentoscargadosengancheService } from '../documentoscargadosenganche/documentoscargadosenganche.service';
import { GetResumeVehiculoPDFDto } from './dto/get-resume-pdf.dto';
import { LogimpresionesService } from '../logimpresiones/logimpresiones.service';
import { generatePDF } from 'src/common/utils/generatepdf.handle';
import { PlacaenganchesService } from '../placaenganches/placaenganches.service';
import { Placaenganches } from '../placaenganches/entities/placaenganches.entity';
import { CreatePlacaenganchesDto } from '../placaenganches/dto/create-placaenganches.dto';
import { ClasesvehiculosService } from '../clasesvehiculos/clasesvehiculos.service';
import { AnosvehiculosService } from '../anosvehiculos/anosvehiculos.service';
import { EmpresagpsService } from '../empresagps/empresagps.service';
import { MarcasvehiculosService } from '../marcasvehiculos/marcasvehiculos.service';
import { ModelosvehiculosService } from '../modelosvehiculos/modelosvehiculos.service';
import { TipocarroceriasService } from '../tipocarrocerias/tipocarrocerias.service';
import { TipovehiculosService } from '../tipovehiculos/tipovehiculos.service';
import { Auditoriadocsvehiculo } from '../auditoriadocsvehiculo/entities/auditoriadocsvehiculo.entity';
import { UpdateDocumentoscargadosvehiculoDto } from '../documentoscargadosvehiculo/dto/update-documentoscargadosvehiculo.dto';
import { UpdateDocumentoscargadosengancheDto } from '../documentoscargadosenganche/dto/update-documentoscargadosenganche.dto';
import { Posiciondisponible } from '../posicion_disponible/entities/posicion_disponible.entity';

@Injectable()
export class ResumevehiculoService {
 
  constructor(
    @InjectModel(Resumevehiculo.name)
    private readonly resumevehiculoModel: ModelExt<Resumevehiculo>,
    @InjectModel(Auditoriadocsvehiculo.name)
    private readonly auditoriaVehiculoModel: ModelExt<Auditoriadocsvehiculo>,
    @InjectModel(Posiciondisponible.name)
    private readonly posicionDisponibleModel: ModelExt<Posiciondisponible>,
    private readonly documentoscargadosresumevehicluloService: DocumentoscargadosvehiculoService,
    private readonly documentoscargadosengancheService: DocumentoscargadosengancheService,
    private readonly logImpresionesModel: LogimpresionesService,
    private readonly placaenganchesModel: PlacaenganchesService,
    private readonly clasesvehiculoService: ClasesvehiculosService,
    private readonly empresagpsService: EmpresagpsService,
    private readonly anosvehiculosService: AnosvehiculosService,
    private readonly marcasvehiculosService: MarcasvehiculosService,
    private readonly modelosvehiculosService: ModelosvehiculosService,
    private readonly tipovehiculosService: TipovehiculosService,
    private readonly tipocarroceriasService: TipocarroceriasService,
  ) {}
  async create(createResumevehiculoDto: CreateResumevehiculoDto) {
    console.log('create data', createResumevehiculoDto);
    try {
      const placasEnganche: string[] = [];
      const enganchesList = createResumevehiculoDto.enganches ?? [];
      const clasevehiculo = await this.clasesvehiculoService.findOne(
        createResumevehiculoDto.clasevehiculo_id,
      );
      const isArticulado =
        (clasevehiculo as any)?.nombre_clasesvehiculos?.toUpperCase() === 'ARTICULADO';
      console.log('Clase vehiculo found (create):', (clasevehiculo as any)?.nombre_clasesvehiculos);
      console.log('Is Articulado (create):', isArticulado);

      for (const eng of enganchesList) {
        if (!isArticulado) continue;
        const engancheData: CreatePlacaenganchesDto = {
          marca_id: eng.marca_id,
          modelo: eng.modelo,
          numero_serie: eng.numero_serie,
          color_id: eng.color_id,
          tipocarroceria_id: eng.tipocarroceria_id,
          placa: eng.placa,
          peso: eng.peso,
          capacidad: eng.capacidad ?? 0,
          configuracionvehicular: eng.configuracionvehicular ?? '',
          foto: eng.foto ?? '',
          propietario_id: createResumevehiculoDto.propietario_id ?? '',
          tenedor_id: createResumevehiculoDto.tenedor_id ?? '',
          user_id: createResumevehiculoDto.user_id,
          numero_plaqueta: eng.numero_plaqueta,
          largo: eng.largo,
          ancho: eng.ancho,
          alto: eng.alto,
          s1: eng.s1,
          s2: eng.s2,
          s3: eng.s3,
          s4: eng.s4,
        };
        const engancheExistente = await this.placaenganchesModel.findByPlaca(
          eng.placa,
        );
        if (engancheExistente && engancheExistente.length > 0) {
          const enganche = engancheExistente[0] as any;
          const engancheId = enganche._id ? String(enganche._id) : enganche.id;
          await this.placaenganchesModel.update(engancheId, engancheData);
        } else {
          await this.placaenganchesModel.create(engancheData);
        }
        placasEnganche.push(eng.placa);
      }

      const { enganches, ...resumevehiculoData } = createResumevehiculoDto;
      const resumevehiculo = await this.resumevehiculoModel.create({
        ...resumevehiculoData,
        placas_enganche: placasEnganche,
      });
      return resumevehiculo;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async updateAceptarLiga(id: any, resumevehiculo: Resumevehiculo) {
    try {
      await this.resumevehiculoModel.updateOne({ _id: id }, resumevehiculo);
      return await this.findOne(id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findAll(pagination: any) {
    const summarySelect =
      'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placas_enganche progreso user_id status disponible tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';
    const limit = Number(pagination?.limit) || 10;
    const page = Number(pagination?.page) || 1;
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      this.resumevehiculoModel
        .find({})
        .select(summarySelect)
        .populate([
          { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
          { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
          { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
          { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.resumevehiculoModel.countDocuments({}),
    ]);

    const totalPages = Math.ceil(totalDocs / limit) || 1;
    const docsWithPos = await this._attachLastPosition(docs);

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
  }

  async findAllNotByUser(userId: string, pagination: any) {
    try {
      const filter = { user_id: { $ne: userId } };
      const summarySelect =
        'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placas_enganche progreso user_id status disponible tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';
      const limit = Number(pagination?.limit) || 10;
      const page = Number(pagination?.page) || 1;
      const skip = (page - 1) * limit;

      const [docs, totalDocs] = await Promise.all([
        this.resumevehiculoModel
          .find(filter)
          .select(summarySelect)
          .populate([
            { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
            { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            {
              path: 'user_id',
              select: 'nombre correo foto _id roles_id',
              populate: {
                path: 'roles_id',
                select: 'nombre _id',
              },
            },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.resumevehiculoModel.countDocuments(filter),
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
    pagination: any,
  ) {
    try {
      const baseFilter: any = { user_id: { $ne: userId } };
      const trimmedText = (text || '').trim();
      const filter = trimmedText
        ? { ...baseFilter, placa: { $regex: trimmedText, $options: 'i' } }
        : baseFilter;

      const summarySelect =
        'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placas_enganche progreso user_id status disponible tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';
      const limit = Number(pagination?.limit) || 10;
      const page = Number(pagination?.page) || 1;
      const skip = (page - 1) * limit;

      const [docs, totalDocs] = await Promise.all([
        this.resumevehiculoModel
          .find(filter)
          .select(summarySelect)
          .populate([
            { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
            { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            {
              path: 'user_id',
              select: 'nombre correo foto _id roles_id',
              populate: {
                path: 'roles_id',
                select: 'nombre _id',
              },
            },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.resumevehiculoModel.countDocuments(filter),
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

  async findOne(id: string): Promise<Resumevehiculo | null> {
    try {
      const resumevehiculo = await this.resumevehiculoModel
        .findById(id)
        .populate([
          {
            path: 'documentosvehiculo',
            select:
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento _id estado_documento',
          },
          { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
          { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
          { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
          { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
        ])
        .lean();

      if (!resumevehiculo) {
        return null;
      }

      // Para cada documento, obtener la auditoría más reciente
      if (resumevehiculo.documentosvehiculo && resumevehiculo.documentosvehiculo.length > 0) {
        const documentosConAuditoria = await Promise.all(
          resumevehiculo.documentosvehiculo.map(async (documento: any) => {
            // Buscar la auditoría más reciente para este documento
            const auditoriaReciente = await this.auditoriaVehiculoModel
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

        resumevehiculo.documentosvehiculo = documentosConAuditoria;
      }

      // Enriquecer placas_enganche con datos completos del enganche
      // y eliminar dataenganches y enganches
      const resumevehiculoObj = resumevehiculo as any;
      
      // Obtener placas de enganche (puede ser string o array)
      let placasEnganche: string[] = [];
      if (resumevehiculoObj.placas_enganche && Array.isArray(resumevehiculoObj.placas_enganche)) {
        placasEnganche = resumevehiculoObj.placas_enganche;
      } else if (resumevehiculoObj.placa_enganche) {
        placasEnganche = [resumevehiculoObj.placa_enganche];
      }
      
      if (placasEnganche && placasEnganche.length > 0) {
        // Buscar todos los enganches asociados a estas placas
        const enganchesCompletos = await Promise.all(
          placasEnganche.map(async (placa: string) => {
            if (!placa) return null;
            
            const enganche = await this.placaenganchesModel.findByPlaca(placa);
            if (enganche && enganche.length > 0) {
              const engancheData = enganche[0] as any;
              
              // Buscar documentos del enganche
              const documentosEnganche = await this.documentoscargadosengancheService.findByResumeVehicle(placa);
              
              return {
                capacidad: engancheData.capacidad,
                color_id: engancheData.color_id,
                configuracionvehicular: engancheData.configuracionvehicular,
                foto: engancheData.foto || '',
                marca_id: engancheData.marca_id,
                modelo: engancheData.modelo,
                numero_serie: engancheData.numero_serie,
                numero_plaqueta: engancheData.numero_plaqueta || '',
                peso: engancheData.peso,
                placa: engancheData.placa,
                propietario_id: engancheData.propietario_id,
                tenedor_id: engancheData.tenedor_id,
                tipocarroceria_id: engancheData.tipocarroceria_id,
                largo: engancheData.largo,
                ancho: engancheData.ancho,
                alto: engancheData.alto,
                documentos: documentosEnganche || [],
                documentosenganche: documentosEnganche || [],
              };
            }
            return null;
          })
        );
        
        // Filtrar nulls y asignar al campo placas_enganche
        resumevehiculoObj.placas_enganche = enganchesCompletos.filter(e => e !== null);
      } else {
        resumevehiculoObj.placas_enganche = [];
      }
      
      // Eliminar dataenganches y enganches si existen
      delete resumevehiculoObj.dataenganches;
      delete resumevehiculoObj.enganches;

      const [resumeWithPos] = await this._attachLastPosition([resumevehiculoObj]);
      return resumeWithPos as any;
    } catch (error) {
      this.handleExceptions(error);
      return null;
    }
  }

  async findByUser(userId: string, pagination: any) {
    try {
      const summarySelect =
        'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placas_enganche progreso user_id status disponible tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';
      const filter = { user_id: userId };
      const limit = Number(pagination?.limit) || 10;
      const page = Number(pagination?.page) || 1;
      const skip = (page - 1) * limit;

      const [docs, totalDocs] = await Promise.all([
        this.resumevehiculoModel
          .find(filter)
          .select(summarySelect)
          .populate([
            { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
            { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.resumevehiculoModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalDocs / limit) || 1;
      const docsWithPos = await this._attachLastPosition(docs);
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

  async findByUserWithSearch(
    userId: string,
    text: string,
    pagination: any,
  ) {
    try {
      const baseFilter = { user_id: userId };
      const trimmedText = (text || '').trim();
      const filter = trimmedText
        ? { ...baseFilter, placa: { $regex: trimmedText, $options: 'i' } }
        : baseFilter;

      const summarySelect =
        'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placas_enganche progreso user_id status disponible tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';
      const limit = Number(pagination?.limit) || 10;
      const page = Number(pagination?.page) || 1;
      const skip = (page - 1) * limit;

      const [docs, totalDocs] = await Promise.all([
        this.resumevehiculoModel
          .find(filter)
          .select(summarySelect)
          .populate([
            { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
            { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
            { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
            { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          ])
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.resumevehiculoModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalDocs / limit) || 1;
      const docsWithPos = await this._attachLastPosition(docs);
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

  async findByVehicule(vehiculo: string): Promise<any[]> {
    try {
      const docs = await this.resumevehiculoModel
        .find({
          resumevehiculo_id: vehiculo,
        })
        .populate([
          {
            path: 'documento_id',
            select: 'nombre_documento _id',
            populate: {
              path: 'grupodocumento',
              select: 'nombre_documento _id',
            },
          },
        ])
        .populate([
          {
            path: 'entidad_emisora',
            select: 'nombre_entidad _id',
          },
        ]);
      return this._attachLastPosition(docs);
    } catch (error) {
      this.handleExceptions(error);
      return [];
    }
  }

  async update(id: string, updateResumevehiculoDto: UpdateResumevehiculoDto) {
    const resumevehiculo = await this.resumevehiculoModel
      .findById(id)
      .populate('clasevehiculo_id');
    
    if (!resumevehiculo) {
      throw new BadRequestException('Vehículo no encontrado');
    }
    
    try {
      console.log('=== UPDATE SERVICE ===');
      console.log('Vehículo ID:', id);
      console.log('User ID:', updateResumevehiculoDto.user_id);
      console.log('Documentos vehiculo originales:', updateResumevehiculoDto?.documentosvehiculo?.length || 0);
      
      //TODO: create methods for insert into other modules
      // Añadir el resumevehicle_id y user_id a cada documento antes de guardar
      const documentosVehiculoConId:any = updateResumevehiculoDto?.documentosvehiculo?.map(doc => ({
        ...doc,
        resumevehicle_id: id,
        user_id: updateResumevehiculoDto.user_id || doc.user_id,
      }));
      
      console.log('Documentos con ID añadido:', documentosVehiculoConId?.length || 0);
      if (documentosVehiculoConId && documentosVehiculoConId.length > 0) {
        documentosVehiculoConId.forEach((doc, index) => {
          console.log(`Doc ${index}: _id=${doc._id || 'NUEVO'}, resumevehicle_id=${doc.resumevehicle_id}`);
        });
      }
      
      const respDocumentoscargadosresumevehicle =
        await this.documentoscargadosresumevehicluloService.updateManyDocumentoscargadosresume(
          documentosVehiculoConId,
        );
      
      console.log('IDs de documentos guardados:', respDocumentoscargadosresumevehicle);

      const documentosEngancheConId = updateResumevehiculoDto?.documentosenganche?.map(doc => ({
        ...doc,
        user_id: updateResumevehiculoDto.user_id || doc.user_id,
      }));

      const respDocumentoscargadosenganche =
        await this.documentoscargadosengancheService.updateManyDocumentoscargadosenganche(
          documentosEngancheConId as UpdateDocumentoscargadosengancheDto[],
        );

      const placasEngancheUpdate: string[] = [];
      const enganchesList = updateResumevehiculoDto.enganches ?? [];
      console.log('Enganches received:', enganchesList.length);
      if (enganchesList.length > 0) {
        const clasevehiculoIdRaw =
          updateResumevehiculoDto.clasevehiculo_id ?? resumevehiculo.clasevehiculo_id;
        const clasevehiculoId =
          typeof clasevehiculoIdRaw === 'string'
            ? clasevehiculoIdRaw
            : (clasevehiculoIdRaw as any)?._id?.toString?.() ??
              (clasevehiculoIdRaw as any)?.toString?.() ??
              '';
        console.log('Clasevehiculo ID raw (update):', clasevehiculoIdRaw);
        console.log('Clasevehiculo ID resolved (update):', clasevehiculoId);

        // Prefer populated data from resumevehiculo if available, otherwise fetch by ID
        const populatedClase = resumevehiculo.clasevehiculo_id as any;
        const populatedNombre: string | undefined =
          populatedClase?.nombre_clasesvehiculos ??
          (typeof populatedClase === 'object' && populatedClase !== null
            ? populatedClase.nombre_clasesvehiculos
            : undefined);

        let nombreClasevehiculo: string | undefined = populatedNombre;
        if (!nombreClasevehiculo && clasevehiculoId) {
          const clasevehiculo = await this.clasesvehiculoService.findOne(clasevehiculoId);
          nombreClasevehiculo = (clasevehiculo as any)?.nombre_clasesvehiculos;
        }

        const isArticulado =
          nombreClasevehiculo?.toUpperCase() === 'ARTICULADO';
        console.log('Clase vehiculo found (update):', nombreClasevehiculo);
        console.log('Is Articulado (update):', isArticulado);
        
        const userIdRaw =
          updateResumevehiculoDto.user_id ?? (resumevehiculo as any).user_id;
        const userId =
          typeof userIdRaw === 'string'
            ? userIdRaw
            : (userIdRaw as any)?._id?.toString?.() ??
              (userIdRaw as any)?.toString?.() ??
              '';
        for (const eng of enganchesList) {
          if (!isArticulado) continue;
          const engancheData: CreatePlacaenganchesDto = {
            marca_id: eng.marca_id,
            modelo: eng.modelo,
            numero_serie: eng.numero_serie,
            color_id: eng.color_id,
            tipocarroceria_id: eng.tipocarroceria_id,
            placa: eng.placa,
            peso: eng.peso,
            capacidad: eng.capacidad ?? 0,
            configuracionvehicular: eng.configuracionvehicular ?? '',
            foto: eng.foto ?? '',
            propietario_id: updateResumevehiculoDto.propietario_id ?? '',
            tenedor_id: updateResumevehiculoDto.tenedor_id ?? '',
            user_id: userId,
            numero_plaqueta: eng.numero_plaqueta,
            largo: eng.largo,
            ancho: eng.ancho,
            alto: eng.alto,
            s1: eng.s1,
            s2: eng.s2,
            s3: eng.s3,
            s4: eng.s4,
          };
          const engancheExistente = await this.placaenganchesModel.findByPlaca(
            eng.placa,
          );
          if (engancheExistente && engancheExistente.length > 0) {
            const enganche = engancheExistente[0] as any;
            const engancheId = enganche._id ? String(enganche._id) : enganche.id;
            await this.placaenganchesModel.update(engancheId, engancheData);
          } else {
            await this.placaenganchesModel.create(engancheData);
          }
          placasEngancheUpdate.push(eng.placa);
        }
      }

      const data: any = {
        fotos: updateResumevehiculoDto.fotos,
        placa: updateResumevehiculoDto.placa,
        tipovehiculo_id: updateResumevehiculoDto.tipovehiculo_id,
        marca_id: updateResumevehiculoDto.marca_id,
        ano_id: updateResumevehiculoDto.ano_id,
        modelo_id: updateResumevehiculoDto.modelo_id,
        modelo: updateResumevehiculoDto.modelo,
        modelo_repotenciado: updateResumevehiculoDto.modelo_repotenciado,
        color_id: updateResumevehiculoDto.color_id,
        tipocarroceria_id: updateResumevehiculoDto.tipocarroceria_id,
        clasevehiculo_id: updateResumevehiculoDto.clasevehiculo_id,
        configuracionvehicular: updateResumevehiculoDto.configuracionvehicular,
        numero_motor: updateResumevehiculoDto.numero_motor,
        numero_serie: updateResumevehiculoDto.numero_serie,
        numero_chasis: updateResumevehiculoDto.numero_chasis,
        peso_vacio: updateResumevehiculoDto.peso_vacio,
        capacidad: updateResumevehiculoDto.capacidad,
        propietario_id: updateResumevehiculoDto.propietario_id,
        tenedor_id: updateResumevehiculoDto.tenedor_id,
        operador_id: updateResumevehiculoDto.operador_id,
        tipo_servicio: updateResumevehiculoDto.tipo_servicio,
        empresagps_id: updateResumevehiculoDto.empresagps_id,
        paginaweb_gps: updateResumevehiculoDto.paginaweb_gps,
        usuario_gps: updateResumevehiculoDto.usuario_gps,
        clave_gps: updateResumevehiculoDto.clave_gps,
        ubicacion: updateResumevehiculoDto.ubicacion,
        calificacion: updateResumevehiculoDto.calificacion,
        ruta_frecuente: updateResumevehiculoDto.ruta_frecuente,
        documentosvehiculo: respDocumentoscargadosresumevehicle,
        documentosenganche: respDocumentoscargadosenganche,
        progreso: updateResumevehiculoDto.progreso,
        user_id: updateResumevehiculoDto.user_id,
        status: updateResumevehiculoDto.status,
        tipo_doc_propietario_id: updateResumevehiculoDto.tipo_doc_propietario_id,
        num_documento_propietario: updateResumevehiculoDto.num_documento_propietario,
        email_propietario: updateResumevehiculoDto.email_propietario,
        tipo_doc_tenedor_id: updateResumevehiculoDto.tipo_doc_tenedor_id,
        num_documento_tenedor: updateResumevehiculoDto.num_documento_tenedor,
        email_tenedor: updateResumevehiculoDto.email_tenedor,
        tipo_doc_operador_id: updateResumevehiculoDto.tipo_doc_operador_id,
        num_documento_operador: updateResumevehiculoDto.num_documento_operador,
        email_operador: updateResumevehiculoDto.email_operador,
        tenedor_liga_id: updateResumevehiculoDto.tenedor_liga_id,
        propietario_liga_id: updateResumevehiculoDto.propietario_liga_id,
        operador_liga_id: updateResumevehiculoDto.operador_liga_id,
      };
      if (placasEngancheUpdate.length > 0) {
        data.placas_enganche = placasEngancheUpdate;
      } else {
        // If enganches was provided but empty, or filtered out, we might want to clear it.
        // But if it was filtered out because not Articulado, we shouldn't clear it if it existed?
        // Actually, if the user sends enganches, they probably intend to set them.
        // If the vehicle is NOT Articulado, we currently skip adding them to placasEngancheUpdate.
        // So data.placas_enganche remains undefined, so DB is not updated.
        // This is correct behavior for non-Articulado (ignore enganches).
        
        // However, if the user sent an empty array `enganches: []`, we want to clear them.
        if (updateResumevehiculoDto.enganches !== undefined && Array.isArray(updateResumevehiculoDto.enganches)) {
           // If array is empty, clear DB field.
           if (updateResumevehiculoDto.enganches.length === 0) {
             data.placas_enganche = [];
           }
           // If array had items but they were all filtered out (not Articulado), 
           // we also don't update data.placas_enganche, so it stays as is.
        }
      }

      // Actualizar el documento en la base de datos
      console.log('Actualizando documento en BD...');
      const updateResult = await this.resumevehiculoModel.updateOne({ _id: id }, data);
      console.log('Resultado del updateOne:', updateResult);
      
      // Devolver el documento actualizado con populate para incluir los documentos
      console.log('Buscando documento actualizado...');
      const updatedDoc = await this.findOne(id);
      console.log('Documento encontrado:', updatedDoc ? 'SI' : 'NO');
      if (updatedDoc && updatedDoc.documentosvehiculo) {
        console.log('Total documentos en respuesta:', updatedDoc.documentosvehiculo.length);
      }
      
      return updatedDoc;
    } catch (error) {
      console.error('Error en update service:', error);
      this.handleExceptions(error);
    }
  }

  async setDisponible(id: string, disponible: boolean) {
    const resumevehiculo = await this.resumevehiculoModel.findById(id);
    if (!resumevehiculo) {
      throw new BadRequestException('Vehículo no encontrado');
    }
    resumevehiculo.disponible = disponible;
    return resumevehiculo.save();
  }

  remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.resumevehiculoModel.delete({ _id });
    return resp;
  }

  async generatePDFFile({
    numdoc,
    typepdf,
    typehead,
  }: GetResumeVehiculoPDFDto) {
    const datvehiculo = await this.findOne(numdoc);
    
    if (!datvehiculo) {
      throw new BadRequestException('Vehículo no encontrado');
    }
    
    const vehiculoId = datvehiculo?._id?.toString() || '';
    const docvehiculo =
      await this.documentoscargadosresumevehicluloService.findByResumeVehicle(
        vehiculoId,
      );
    const listdocs = (docvehiculo ?? []).map((item: any) => {
      const foto = fs.readFileSync(
        path.join(process.cwd(), `./public/uploads/${item.documento}`),
        { encoding: 'base64' },
      );
      return {
        documento: foto,
        grupodocumento_id: item.grupodocumento_id,
        documento_id: item.documento_id,
        fecha_expedicion: new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(item.fecha_expedicion)),
        fecha_vencimiento: new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(item.fecha_vencimiento)),
        categoria: item.categoria,
        codigo_referencia: item.codigo_referencia,
        entidad_emisora: item.entidad_emisora,
        estado_documento: item.estado_documento,
        observaciones: item.observaciones,
      };
    });
    const enganche = await this.placaenganchesModel.findByPlaca(
      datvehiculo.placa,
    );
    const docsenganche =
      await this.documentoscargadosengancheService.findByResumeVehicle(
        datvehiculo.placa,
      );
    const listdocsenganche = (docsenganche ?? []).map((item: any) => {
      // const foto = fs.readFileSync(
      //   path.join(process.cwd(), `./public/uploads/${item.documento}`),
      //   { encoding: 'base64' },
      // );
      return {
        //documento: foto,
        grupodocumento_id: item.grupodocumento_id,
        documento_id: item.documento_id,
        fecha_expedicion: new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(item.fecha_expedicion)),
        fecha_vencimiento: new Intl.DateTimeFormat('es-ES', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(item.fecha_vencimiento)),
        categoria: item.categoria,
        codigo_referencia: item.codigo_referencia,
        entidad_emisora: item.entidad_emisora,
        estado_documento: item.estado_documento,
        observaciones: item.observaciones,
      };
    });
    const fechaActual = Date.now();
    const dataFecha = {
      _id: new mongoose.Types.ObjectId().toString(),
      resume_id: '',
      fecha_impresion: new Date(fechaActual),
      __v: '0',
      resumevehiculo_id: vehiculoId,
    };
    const fechaImp = await this.logImpresionesModel.create(dataFecha);
    //TODO: Mostrar fecha ultimo estudio de seguridad
    let festudio = String;
    const estudioSeg = Object.values(listdocs)
      .filter(
        (item: any) =>
          item.documento_id.nombre_documento ===
          'ESTUDIO DE SEGURIDAD COMPLETO',
      )
      .map((r: any) => r);
    if (estudioSeg !== undefined) {
      festudio = estudioSeg[0].fecha_vencimiento;
    }
    const marcaagua = fs.readFileSync(
      path.join(process.cwd(), `./public/uploads/marca.png`),
      { encoding: 'base64' },
    );
    const code = `${datvehiculo?._id}`;
    const codigoFinal = `HVC-` + code.slice(0, 8);
    const arrayFotos = Object.values(datvehiculo.fotos).map((r: any) => {
      const foto = fs.readFileSync(
        path.join(process.cwd(), `./public/uploads/${r}`),
        { encoding: 'base64' },
      );
      //console.log(foto);
      return {
        d: foto,
      };
    });
    //TODO:PREPRARE IMPORTS DATA TO SERVICES

    //data resume vehiculo fro pdf;
    const data: any = {
      basic: {
        fotos: arrayFotos,
        placa: datvehiculo.placa,
        tipovehiculo_id: datvehiculo.tipovehiculo_id,
        marca_id: datvehiculo.marca_id,
        ano_id: datvehiculo.ano_id,
        modelo_id: datvehiculo.modelo_id,
        modelo: datvehiculo.modelo,
        modelo_repotenciado: datvehiculo.modelo_repotenciado,
        color_id: datvehiculo.color_id,
        tipocarroceria_id: datvehiculo.tipocarroceria_id,
        clasevehiculo_id: datvehiculo.clasevehiculo_id,
        configuracionvehicular: datvehiculo.configuracionvehicular,
        numero_motor: datvehiculo.numero_motor,
        numero_serie: datvehiculo.numero_serie,
        numero_chasis: datvehiculo.numero_chasis,
        peso_vacio: datvehiculo.peso_vacio,
        capacidad: datvehiculo.capacidad,
        propietario_id: datvehiculo.propietario_id,
        tenedor_id: datvehiculo.tenedor_id,
        operador_id: datvehiculo.operador_id,
        tipo_servicio: datvehiculo.tipo_servicio,
        empresagps_id: datvehiculo.empresagps_id,
        paginaweb_gps: datvehiculo.paginaweb_gps,
        usuario_gps: datvehiculo.usuario_gps,
        clave_gps: datvehiculo.clave_gps,
        ubicacion: datvehiculo.ubicacion,
        calificacion: datvehiculo.calificacion,
        ruta_frecuente: datvehiculo.ruta_frecuente,
        codigo: codigoFinal,
      },
      marcaagua: marcaagua,
      documentos: listdocs,
      dataenganche: {
        capacidad: enganche?.[0]?.capacidad || '',
        color_id: enganche?.[0]?.color_id || '',
        configuracionvehicular: enganche?.[0]?.configuracionvehicular || '',
        foto: enganche?.[0]?.foto || '',
        marca_id: enganche?.[0]?.marca_id || '',
        modelo: enganche?.[0]?.modelo || '',
        numero_serie: enganche?.[0]?.numero_serie || '',
        peso: enganche?.[0]?.peso || '',
        placa: enganche?.[0]?.placa || '',
        propietario_id: enganche?.[0]?.propietario_id || '',
        tenedor_id: enganche?.[0]?.tenedor_id || '',
        tipocarroceria_id: enganche?.[0]?.tipocarroceria_id || '',
      },
      docsenganche: listdocsenganche,
      type: Number(typepdf),
      head: Number(typehead),
      fechaimpresion: new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(fechaImp?.fecha_impresion ?? new Date())),
      fecha_estudio: festudio,
    };
    const pdf = await generatePDF(data);
    return pdf;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Resume vehiculo exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Resume vehiculo - Check server logs`,
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
      { $match: { resumevehiculo_id: { $in: ids } } },
      { $sort: { fecha_creacion: -1 } },
      {
        $group: {
          _id: '$resumevehiculo_id',
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
