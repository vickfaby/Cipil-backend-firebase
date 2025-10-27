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

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name)
    private readonly resumeModel: ModelExt<Resume>,
    @InjectModel(Auditoriadocsoperador.name)
    private readonly auditoriaModel: ModelExt<Auditoriadocsoperador>,
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

  async findAll(pagination: any) {
    //return this.resumeModel.find({}).select('-__v');
    return this.resumeModel.paginate({}, pagination);
  }

  async findAllNotByUser(userId: string, pagination: any) {
    try {
      const filter = { user_id: { $ne: userId } };
      return this.resumeModel.paginate(filter, pagination);
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
        ? {
            ...baseFilter,
            $or: [
              { nombre: { $regex: trimmedText, $options: 'i' } },
              { apellido: { $regex: trimmedText, $options: 'i' } },
            ],
          }
        : baseFilter;

      return this.resumeModel.paginate(filter, pagination);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.resumeModel
        .findById(id)
        .populate({
          path: 'entidades_seguridad_social',
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
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento _id',
          },
        ]);
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
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento _id',
          },
        ])
        .lean();

      if (!resume) {
        return null;
      }

      // Para cada documento, obtener la auditoría más reciente
      if (resume.documentos && resume.documentos.length > 0) {
        const documentosConAuditoria = await Promise.all(
          resume.documentos.map(async (documento: any) => {
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

        resume.documentos = documentosConAuditoria;
      }

      return resume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByDocument(numero: string) {
    try {
      return await this.resumeModel
        .find({ numerodocumento: numero })
        .select(
          '-foto -tipodocumento -categoria_id -tipotercero_id -tipopersona -sexo -telefono -direccion -pais -estado -ciudad -ubicacion -fecha_nacimiento -calificacion -progreso -entidades_seguridad_social -referencias -documentos -user_id -_id -status -__v',
        );
    } catch (error) {
      return error;
    }
  }

  async findByUsuarioEmpresa(usuarioEmpresaId: string, pagination: any) {
    try {
      const filter = {
        usuario_empresa_id: {
          $exists: true,
          $eq: usuarioEmpresaId,
        },
      };
      return this.resumeModel.paginate(filter, pagination);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuarioEmpresaWithSearch(
    usuarioEmpresaId: string,
    text: string,
    pagination: any,
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

      return this.resumeModel.paginate(filter, pagination);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuarioOperador(usuarioOperadorId: string, pagination: any) {
    try {
      const filter = {
        usuario_operador_id: {
          $exists: true,
          $eq: usuarioOperadorId,
        },
      };
      return this.resumeModel.paginate(filter, pagination);
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
      console.log('Documentos existentes:', resume.documentos?.map((d: any) => ({
        _id: d._id?.toString() || d.toString(),
      })));
      console.log('Documentos en el DTO:', updateResumeDto.documentos?.map((d: any) => ({
        _id: d._id,
      })));

      // NUEVO: Procesar subdocumentos manteniendo IDs existentes
      let respSeguro: any = resume.entidades_seguridad_social;
      let respRferencia: any = resume.referencias;
      let respDocumentoscargadosresume: any = resume.documentos;

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

      console.log('IDs de documentos después del procesamiento:', respDocumentoscargadosresume?.map((d: any) => d.toString()));

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

      const updateData: any = {
        entidades_seguridad_social: respSeguro,
        referencias: respRferencia,
        documentos: respDocumentoscargadosresume,
      };

      simpleFields.forEach((field) => {
        if (updateResumeDto[field] !== undefined) {
          updateData[field] = updateResumeDto[field];
        }
      });

      await resume.updateOne(updateData);

      // Consultar el resume actualizado con todos los populates
      const updatedResume = await this.resumeModel
        .findById(id)
        .populate({
          path: 'entidades_seguridad_social',
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
              'grupodocumento_id documento_id fecha_expedicion fecha_vencimiento nombre categoria codigo_referencia observaciones entidad_emisora documento _id',
          },
        ]);

      return updatedResume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //TODO: ADD SEGSOCIAL, REFERENCIAS, DOCUMENTOS CARGADOS RESUMEN
    const _id = new Types.ObjectId(id);
    const resp = this.resumeModel.delete({ _id });
    return resp;
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
      return error;
    }
  }

  async generatePDFFile({
    typedoc,
    numdoc,
    typepdf,
    typehead,
  }: GetResumePDFDto) {
    const datresume = await this.getResumeByDocument(typedoc, Number(numdoc));
    const resumeId = datresume[0]._id;
    const entsegsoc = await this.seguridadsocialService.findByResume(resumeId);
    const dataentidades: any = entsegsoc || {};
    const list = Object.values(dataentidades).map((item: any) => {
      return {
        estado_afiliacion: item.estado_afiliacion ? 'Activo' : 'Inactivo',
        fecha_afiliacion: item.fecha_afiliacion,
        grupoentidad_id: item.grupoentidad_id, //register split an splice
        observaciones: item.observaciones,
        tipoentidad_id: item.tipoentidad_id,
      };
    });
    const refresume = await this.referenciasService.findByResume(resumeId);
    const listref = (refresume ?? []).map((item: any) => {
      return {
        relacion: item.relacion,
        nombre_completo: item.nombre_completo || '',
        telefonos: item.telefonos || [],
        pais_referencia: item.pais_referencia || '',
        estado_referencia: item.estado_referencia || '',
        ciudad_referencia: item.ciudad_referencia || '',
        direccion: item.direccion || '',
      };
    });
    const docresume =
      await this.documentoscargadosresumeService.findByResume(resumeId);
    const listdocs = (docresume ?? []).map((item: any) => {
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
    const paisbasicdata = (await this.coutriesModel.findById(datresume[0].pais)) || [];
    const statebasicdata = (await this.statesModel.findBynumber(
      datresume[0].estado,
    )) || [];
    const citybasicdata = (await this.citiesModel.findBynumber(
      datresume[0].ciudad,
    )) || [];
    //TODO: Guardar fecha de impresión
    const fechaActual = Date.now();
    const dataFecha = {
      _id: new mongoose.Types.ObjectId().toString(),
      resume_id: datresume[0]._id,
      fecha_impresion: new Date(fechaActual),
      __v: '0',
      resumevehiculo_id: '',
    };
    const fechaImp = await this.logImpresionesModel.create(dataFecha);
    const fechaImpDate = fechaImp?.fecha_impresion ?? new Date();
    //TODO: Mostrar fecha ultimo estudio de seguridad
    let festudio = String;
    const estudioSeg = Object.values(listdocs)
      .filter(
        (item: any) =>
          item.documento_id.nombre_documento ===
          'ESTUDIO DE SEGURIDAD COMPLETO',
      )
      .map((r: any) => {
        return {
          fecha_vencimiento: r.fecha_vencimiento,
        };
      });
    if (estudioSeg !== undefined) {
      festudio = estudioSeg[0].fecha_vencimiento;
    }
    //show image
    const fotouploads = fs.readFileSync(
      path.join(process.cwd(), `./public/uploads/${datresume[0].foto}`),
      { encoding: 'base64' },
    );
    const marcaagua = fs.readFileSync(
      path.join(process.cwd(), `./public/uploads/marca.png`),
      { encoding: 'base64' },
    );
    const code = `${datresume[0]?._id}`;
    const codigoFinal = `HVC-` + code.slice(0, 8);
    //data resume for pdf;
    const data: any = {
      basic: {
        foto: fotouploads,
        codigo: codigoFinal,
        tipodocumento: datresume[0].tipodocumento.nombre_tipodocumento,
        numerodocumento: datresume[0].numerodocumento,
        categoria_id: datresume[0].categoria_id.nombre_categoria,
        tipotercero_id: datresume[0].tipotercero_id,
        tipopersona: datresume[0].tipopersona.nombre_tipopersona,
        razonsocial: datresume[0].razonsocial,
        nombre: datresume[0].nombre,
        apellido: datresume[0].apellido,
        sexo: datresume[0].sexo.nombre_sexo,
        telefono: datresume[0].telefono,
        direccion: datresume[0].direccion,
        pais: paisbasicdata[0].name,
        estado: statebasicdata[0].name,
        ciudad: citybasicdata[0].name,
        ubicacion: datresume[0].ubicacion,
        fecha_nacimiento: new Intl.DateTimeFormat('en-ES').format(
          new Date(datresume[0].fecha_nacimiento),
        ),
        calificacion: datresume[0].calificacion,
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
      fecha_estudio: festudio,
    };
    //console.log('🚀 ~ data:', data.basic);
    const pdf = await generatePDF(data);
    return pdf;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Resume exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Resume - Check server logs`,
    );
  }
}
