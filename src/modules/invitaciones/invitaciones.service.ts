import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateInvitacionDto } from './dto/create-invitacion.dto';
import { UpdateInvitacionDto } from './dto/update-invitacion.dto';
import { Invitaciones } from './entities/invitaciones.entity';
import { EstadoInvitacion } from './entities/estado-invitacion.enum';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { Resume } from '../resume/entities/resume.entity';
import { InvitacionResumenMatchDto } from './dto/invitaciones-resume-match.dto';
import { InvitacionVehiculo } from '../invitacionvehiculo/entities/invitacionvehiculo.entity';
import { LigarVehiculo } from '../ligarvehiculo/entities/ligarvehiculo.entity';
import { Resumevehiculo } from '../resumevehiculo/entities/resumevehiculo.entity';

@Injectable()
export class InvitacionesService {
  constructor(
    @InjectModel(Invitaciones.name)
    private readonly invitacionesModel: ModelExt<Invitaciones>,
    @InjectModel(Usuarios.name)
    private readonly usuariosModel: ModelExt<Usuarios>,
    @InjectModel(Resume.name)
    private readonly resumeModel: ModelExt<Resume>,
    @InjectModel(InvitacionVehiculo.name)
    private readonly invitacionVehiculoModel: ModelExt<InvitacionVehiculo>,
    @InjectModel(LigarVehiculo.name)
    private readonly ligarVehiculoModel: ModelExt<LigarVehiculo>,
    @InjectModel(Resumevehiculo.name)
    private readonly resumevehiculoModel: ModelExt<Resumevehiculo>,
  ) {}

  async create(createInvitacionDto: CreateInvitacionDto) {
    try {
      const invitacion =
        await this.invitacionesModel.create(createInvitacionDto);
      return invitacion;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      // Temporal: Verificar datos crudos
      const rawData = await this.invitacionesModel
        .find({ deleted: false })
        .select('-__v -deleted')
        .exec();

      console.log(
        'Datos crudos (sin populate):',
        JSON.stringify(rawData, null, 2),
      );

      // Verificar si existen usuarios y resumes
      const usuariosCount = await this.usuariosModel.countDocuments();
      const resumeCount = await this.resumeModel.countDocuments();

      console.log(`Usuarios en BD: ${usuariosCount}`);
      console.log(`Resumes en BD: ${resumeCount}`);

      // Mostrar algunos IDs válidos para referencia
      const usuariosValidos = await this.usuariosModel
        .find()
        .limit(3)
        .select('_id nombre correo');
      const resumesValidos = await this.resumeModel
        .find()
        .limit(3)
        .select('_id nombre apellido');

      console.log(
        'Usuarios válidos disponibles:',
        usuariosValidos.map((u) => ({
          id: u._id,
          nombre: u.nombre,
          correo: u.correo,
        })),
      );
      console.log(
        'Resumes válidos disponibles:',
        resumesValidos.map((r) => ({
          id: r._id,
          nombre: r.nombre,
          apellido: r.apellido,
        })),
      );

      // Si hay datos null, buscar algunos ejemplos válidos
      if (rawData.length > 0) {
        const firstItem = rawData[0];
        console.log(
          'ID en invitación - usuario_invitante_id:',
          firstItem.usuario_invitante_id,
        );
        console.log(
          'ID en invitación - resume_operador_id:',
          firstItem.resume_operador_id,
        );

        if (firstItem.usuario_invitante_id) {
          const usuario = await this.usuariosModel.findById(
            firstItem.usuario_invitante_id,
          );
          console.log('Usuario encontrado:', usuario ? 'SÍ' : 'NO');
          if (usuario) {
            console.log('Usuario encontrado:', {
              nombre: usuario.nombre,
              correo: usuario.correo,
            });
          }
        }
        if (firstItem.resume_operador_id) {
          const resume = await this.resumeModel.findById(
            firstItem.resume_operador_id,
          );
          console.log('Resume encontrado:', resume ? 'SÍ' : 'NO');
          if (resume) {
            console.log('Resume encontrado:', {
              nombre: resume.nombre,
              apellido: resume.apellido,
            });
          }
        }
      }

      return await this.invitacionesModel
        .find({ deleted: false })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: 'nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .select('-__v -deleted')
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.invitacionesModel
        .findById(id)
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: 'nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuario(usuarioId: string) {
    try {
      // Obtener invitaciones de operadores
      const invitacionesOperadores = await this.invitacionesModel
        .find({
          usuario_invitante_id: usuarioId,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: 'nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .sort({ createdAt: -1 })
        .exec();

      // Obtener invitaciones de vehículos
      const invitacionesVehiculos = await this.invitacionVehiculoModel
        .find({
          usuario_invitante_id: usuarioId,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_vehiculo_id',
            select: 'placa modelo',
            model: 'Resumevehiculo',
          },
        ])
        .sort({ createdAt: -1 })
        .exec();

      // Obtener invitaciones de ligadura
      const invitacionesLigadura = await this.ligarVehiculoModel
        .find({
          usuario_invitante_id: usuarioId,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'usuario_a_ligar_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_vehiculo_id',
            select: 'placa modelo',
            model: 'Resumevehiculo',
          },
        ])
        .sort({ createdAt: -1 })
        .exec();

      // Combinar todas las invitaciones y agregar tipo
      const todasLasInvitaciones = [
        ...invitacionesOperadores.map((inv) => {
          const invObj = inv.toObject() as any;
          return {
            ...invObj,
            tipo_invitacion: 'operador',
            tipo_relacion: null,
            createdAt: invObj.createdAt || new Date(),
            updatedAt: invObj.updatedAt || new Date(),
          };
        }),
        ...invitacionesVehiculos.map((inv) => {
          const invObj = inv.toObject() as any;
          return {
            ...invObj,
            tipo_invitacion: 'vehiculo',
            tipo_relacion: null,
            createdAt: invObj.createdAt || new Date(),
            updatedAt: invObj.updatedAt || new Date(),
          };
        }),
        ...invitacionesLigadura.map((inv) => {
          const invObj = inv.toObject() as any;
          return {
            ...invObj,
            tipo_invitacion: 'ligadura',
            tipo_relacion: inv.tipo_relacion,
            createdAt: invObj.createdAt || new Date(),
            updatedAt: invObj.updatedAt || new Date(),
          };
        }),
      ];

      // Ordenar por fecha de creación (más recientes primero)
      return todasLasInvitaciones.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByResume(resumeId: string) {
    try {
      return await this.invitacionesModel
        .find({
          resume_operador_id: resumeId,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
        ])
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  /**
   * Cruza todos los resumes cuyo user_id coincide con el usuario dado
   * y devuelve sólo las invitaciones cuyo resume_id esté en ese conjunto.
   */
  async findMatchesByUsuario(
    userId: string,
  ): Promise<InvitacionResumenMatchDto[] | undefined> {
    try {
      // 1) Obtener todos los resumes del usuario
      const resumes = await this.resumeModel
        .find({ user_id: userId })
        .select('_id user_id nombre apellido razonsocial')
        .exec();

      if (resumes.length === 0) return [];

      const resumeIds = resumes.map((r) => r._id);

      // 2) Obtener invitaciones que referencien esos resumes
      const invitaciones = await this.invitacionesModel
        .find({ resume_operador_id: { $in: resumeIds }, deleted: false })
        .select('-__v -deleted')
        .exec();

      // 3) Armar DTO de coincidencias sólo para los que efectivamente coincidan
      const resumeIndex = new Map<string, any>();
      resumes.forEach((r) => {
        resumeIndex.set(String(r._id), r);
      });

      const result: InvitacionResumenMatchDto[] = invitaciones
        .filter((inv) => resumeIndex.has(String(inv.resume_operador_id)))
        .map((inv) => {
          const r = resumeIndex.get(String(inv.resume_operador_id));
          return {
            invitacion_id: String(inv._id),
            resume_id: String(inv.resume_operador_id),
            user_id: String(r.user_id),
            resume: r,
            invitacion: inv,
          } as InvitacionResumenMatchDto;
        });

      return result;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findResumeWithInvitationsByUser(userId: string, pagination: any) {
    try {
      console.log('=== DEBUGGING INVITACIONES ===');
      console.log('Usuario ID:', userId);

      // 1) Obtener todos los resumes del usuario (incluyendo status: false)
      const userResumes = await this.resumeModel
        .find({ user_id: userId })
        .select('_id user_id nombre apellido status')
        .exec();

      // 2) Obtener todos los resumes vehículo del usuario
      const userResumeVehiculos = await this.resumevehiculoModel
        .find({ user_id: userId })
        .select('_id user_id placa modelo status')
        .exec();

      console.log('Resumes del usuario encontrados:', userResumes.length);
      console.log('Resumes:', userResumes.map(r => ({ id: r._id, user_id: r.user_id, nombre: r.nombre, status: r.status })));
      
      console.log('Resumes vehículo del usuario encontrados:', userResumeVehiculos.length);
      console.log('Resumes vehículo:', userResumeVehiculos.map(r => ({ id: r._id, user_id: r.user_id, placa: r.placa, status: r.status })));

      const userResumeIds = userResumes.map(r => r._id);
      const userResumeVehiculoIds = userResumeVehiculos.map(r => r._id);
      const allUserResumeIds = [...userResumeIds, ...userResumeVehiculoIds];
      
      console.log('IDs de resumes del usuario (operadores):', userResumeIds);
      console.log('IDs de resumes vehículo del usuario:', userResumeVehiculoIds);
      console.log('Todos los IDs de resumes del usuario:', allUserResumeIds);

      // 2) Buscar TODAS las invitaciones (sin filtro de estado) para debug
      const allInvitaciones = await this.invitacionesModel
        .find({
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: '_id user_id nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      console.log('TODAS las invitaciones en el sistema:', allInvitaciones.length);
      console.log('Estados de todas las invitaciones:', allInvitaciones.map(inv => ({
        id: inv._id,
        estado: inv.estado_invitacion,
        resume_id: inv.resume_operador_id?._id,
        resume_user_id: inv.resume_operador_id?.user_id
      })));

      // 3) Buscar invitaciones de operadores RECIBIDAS por el usuario
      const invitacionesOperadores = await this.invitacionesModel
        .find({
          resume_operador_id: { $in: userResumeIds },
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: '_id user_id nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 4) Buscar invitaciones de vehículos RECIBIDAS por el usuario
      const invitacionesVehiculos = await this.invitacionVehiculoModel
        .find({
          resume_vehiculo_id: { $in: userResumeVehiculoIds },
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_vehiculo_id',
            select: '_id user_id placa modelo',
            model: 'Resumevehiculo',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 5) Buscar invitaciones de ligadura RECIBIDAS por el usuario
      const invitacionesLigadura = await this.ligarVehiculoModel
        .find({
          resume_vehiculo_id: { $in: userResumeVehiculoIds },
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'usuario_a_ligar_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_vehiculo_id',
            select: '_id user_id placa modelo',
            model: 'Resumevehiculo',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 6) Combinar todas las invitaciones
      const validInvitaciones = [...invitacionesOperadores, ...invitacionesVehiculos, ...invitacionesLigadura];

      console.log('Invitaciones de operadores:', invitacionesOperadores.length);
      console.log('Invitaciones de vehículos:', invitacionesVehiculos.length);
      console.log('Invitaciones de ligadura:', invitacionesLigadura.length);
      console.log('Total invitaciones recibidas:', validInvitaciones.length);

      // 4) Separar IDs por tipo de resume
      const resumeOperadorIds = [
        ...new Set(
          invitacionesOperadores.map((inv) => String((inv as any).resume_operador_id._id))
        ),
      ];
      
      const resumeVehiculoIds = [
        ...new Set([
          ...invitacionesVehiculos.map((inv) => String((inv as any).resume_vehiculo_id._id)),
          ...invitacionesLigadura.map((inv) => String((inv as any).resume_vehiculo_id._id)),
        ]),
      ];

      console.log('Resume operador IDs con invitaciones:', resumeOperadorIds);
      console.log('Resume vehículo IDs con invitaciones:', resumeVehiculoIds);

      if (resumeOperadorIds.length === 0 && resumeVehiculoIds.length === 0) {
        // Si no hay resumes con invitaciones, retornar resultado vacío
        return {
          docs: [],
          totalDocs: 0,
          limit: pagination.limit || 10,
          totalPages: 0,
          page: pagination.page || 1,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        };
      }

      // 5) Paginar resumes de operadores
      let resumePage: any = { docs: [], totalDocs: 0, totalPages: 0, page: 1, limit: 10 };
      
      if (resumeOperadorIds.length > 0) {
        console.log('Buscando resumes de operadores con IDs:', resumeOperadorIds);
        
        resumePage = (await this.resumeModel.paginate(
          { _id: { $in: resumeOperadorIds } },
          {
            ...pagination,
            sort: { createdAt: -1 },
          },
        )) as any;
        
        console.log('Resumes de operadores encontrados:', resumePage.docs?.length || 0);
      }

      // 6) Buscar resumes de vehículos (sin paginación por ahora)
      let resumeVehiculoDocs: any[] = [];
      
      if (resumeVehiculoIds.length > 0) {
        console.log('Buscando resumes de vehículos con IDs:', resumeVehiculoIds);
        
        resumeVehiculoDocs = await this.resumevehiculoModel
          .find({ _id: { $in: resumeVehiculoIds } })
          .sort({ createdAt: -1 })
          .exec();
        
        console.log('Resumes de vehículos encontrados:', resumeVehiculoDocs.length);
      }

      // 7) Agrupar invitaciones por resume
      const resumeIdToInvitaciones: Record<string, any[]> = {};
      
      // Agrupar invitaciones de operadores
      for (const inv of invitacionesOperadores) {
        const key = String((inv as any).resume_operador_id._id);
        if (!resumeIdToInvitaciones[key]) resumeIdToInvitaciones[key] = [];
        resumeIdToInvitaciones[key].push(inv);
      }
      
      // Agrupar invitaciones de vehículos
      for (const inv of invitacionesVehiculos) {
        const key = String((inv as any).resume_vehiculo_id._id);
        if (!resumeIdToInvitaciones[key]) resumeIdToInvitaciones[key] = [];
        resumeIdToInvitaciones[key].push(inv);
      }
      
      // Agrupar invitaciones de ligadura
      for (const inv of invitacionesLigadura) {
        const key = String((inv as any).resume_vehiculo_id._id);
        if (!resumeIdToInvitaciones[key]) resumeIdToInvitaciones[key] = [];
        resumeIdToInvitaciones[key].push(inv);
      }

      // 8) Combinar resumes de operadores y vehículos
      const allResumes = [
        ...(resumePage.docs || []).map((r: any) => ({
          ...(r.toObject ? r.toObject() : r),
          tipo_resume: 'operador',
          invitaciones: resumeIdToInvitaciones[String(r._id)] || [],
        })),
        ...resumeVehiculoDocs.map((r: any) => ({
          ...(r.toObject ? r.toObject() : r),
          tipo_resume: 'vehiculo',
          invitaciones: resumeIdToInvitaciones[String(r._id)] || [],
        })),
      ];

      // 9) Ordenar por fecha de creación (más recientes primero)
      allResumes.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // 10) Aplicar paginación manual
      const totalDocs = allResumes.length;
      const totalPages = Math.ceil(totalDocs / (pagination.limit || 10));
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocs = allResumes.slice(startIndex, endIndex);

      return {
        docs: paginatedDocs,
        totalDocs,
        totalPages,
        page,
        limit,
        pagingCounter: startIndex + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // ENDPOINT UNIFICADO: Todas las invitaciones RECIBIDAS (operador, vehículo, ligadura)
  async findAllReceivedInvitationsByUser(userId: string, pagination: any) {
    try {
      const limit = Number(pagination?.limit) || 10;
      const page = Number(pagination?.page) || 1;

      // 1) Obtener IDs de resumes (operador) y resumes vehículo del usuario (incluyendo status false)
      const [userResumes, userResumeVehiculos] = await Promise.all([
        this.resumeModel
          .find({ user_id: userId })
          .select('_id user_id nombre apellido status')
          .exec(),
        this.resumevehiculoModel
          .find({ user_id: userId })
          .select('_id user_id placa modelo status')
          .exec(),
      ]);

      const userResumeIds = userResumes.map((r: any) => r._id);
      const userResumeVehiculoIds = userResumeVehiculos.map((r: any) => r._id);

      // 2) Cargar invitaciones por cada tipo (sin filtrar por estado)
      const [invitacionesOperadores, invitacionesVehiculos, invitacionesLigadura] = await Promise.all([
        this.invitacionesModel
          .find({
            resume_operador_id: { $in: userResumeIds },
            status: true,
            deleted: false,
          })
          .populate([
            { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
            { path: 'resume_operador_id', select: '_id nombre apellido razonsocial', model: 'Resume' },
          ])
          .sort({ createdAt: -1 })
          .select('-__v -deleted')
          .exec(),

        this.invitacionVehiculoModel
          .find({
            resume_vehiculo_id: { $in: userResumeVehiculoIds },
            status: true,
            deleted: false,
          })
          .populate([
            { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
            { path: 'resume_vehiculo_id', select: '_id placa modelo', model: 'Resumevehiculo' },
          ])
          .sort({ createdAt: -1 })
          .select('-__v -deleted')
          .exec(),

        this.ligarVehiculoModel
          .find({
            // Cualquier ligadura asociada a vehículos del usuario
            $or: [
              { usuario_a_ligar_id: userId },
              { resume_vehiculo_id: { $in: userResumeVehiculoIds } },
            ],
            status: true,
            deleted: false,
          })
          .populate([
            { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
            { path: 'usuario_a_ligar_id', select: 'nombre correo', model: 'Usuarios' },
            { path: 'resume_vehiculo_id', select: '_id placa modelo', model: 'Resumevehiculo' },
          ])
          .sort({ createdAt: -1 })
          .select('-__v -deleted')
          .exec(),
      ]);

      // 3) Unificar estructura
      const mapDoc = (inv: any, overrides: any = {}) => {
        const obj = inv.toObject ? inv.toObject() : inv;
        return {
          ...obj,
          createdAt: obj.createdAt || inv.createdAt || new Date(0),
          updatedAt: obj.updatedAt || inv.updatedAt || obj.createdAt || new Date(0),
          ...overrides,
        };
      };

      const all = [
        ...invitacionesOperadores.map((inv: any) =>
          mapDoc(inv, {
            tipo_invitacion: 'operador',
            resume: inv.resume_operador_id || null,
            resume_vehiculo: null,
            tipo_relacion: null,
          }),
        ),
        ...invitacionesVehiculos.map((inv: any) =>
          mapDoc(inv, {
            tipo_invitacion: 'vehiculo',
            resume: null,
            resume_vehiculo: inv.resume_vehiculo_id || null,
            tipo_relacion: null,
          }),
        ),
        ...invitacionesLigadura.map((inv: any) =>
          mapDoc(inv, {
            tipo_invitacion: 'ligadura',
            resume: null,
            resume_vehiculo: inv.resume_vehiculo_id || null,
            tipo_relacion: inv.tipo_relacion || null,
          }),
        ),
      ];

      // 4) Ordenar por fecha de creación (desc)
      all.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // 5) Paginación manual
      const totalDocs = all.length;
      const totalPages = Math.ceil(totalDocs / limit) || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocs = all.slice(startIndex, endIndex);

      return {
        docs: paginatedDocs,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: startIndex + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateInvitacionDto: UpdateInvitacionDto) {
    const updated = await this.invitacionesModel.findByIdAndUpdate(
      id,
      updateInvitacionDto,
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException(`Invitación con id ${id} no encontrada`);
    }
    return updated;
  }

  async acceptInvitation(id: string) {
    const updateData = {
      estado_invitacion: EstadoInvitacion.ACEPTADA,
      fecha_respuesta: new Date(),
    };
    return this.update(id, updateData);
  }

  async rejectInvitation(id: string) {
    const updateData = {
      estado_invitacion: EstadoInvitacion.RECHAZADA,
      fecha_respuesta: new Date(),
    };
    return this.update(id, updateData);
  }

  async cancelInvitation(id: string) {
    const updateData = {
      estado_invitacion: EstadoInvitacion.CANCELADA,
      fecha_respuesta: new Date(),
    };
    return this.update(id, updateData);
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.invitacionesModel.delete({ _id });
    return resp;
  }

  async debugInvitacionesByUsuario(userId: string) {
    try {
      console.log('=== DEBUGGING INVITACIONES ===');
      console.log('Usuario ID:', userId);

      // 1) Obtener todos los resumes del usuario (incluyendo status: false)
      const userResumes = await this.resumeModel
        .find({ user_id: userId })
        .select('_id user_id nombre apellido status')
        .exec();

      // 2) Obtener todos los resumes vehículo del usuario
      const userResumeVehiculos = await this.resumevehiculoModel
        .find({ user_id: userId })
        .select('_id user_id placa modelo status')
        .exec();

      console.log('Resumes del usuario encontrados:', userResumes.length);
      console.log('Resumes:', userResumes.map(r => ({ id: r._id, user_id: r.user_id, nombre: r.nombre, status: r.status })));
      
      console.log('Resumes vehículo del usuario encontrados:', userResumeVehiculos.length);
      console.log('Resumes vehículo:', userResumeVehiculos.map(r => ({ id: r._id, user_id: r.user_id, placa: r.placa, status: r.status })));

      // Combinar IDs de ambos tipos de resumes
      const userResumeIds = userResumes.map(r => r._id);
      const userResumeVehiculoIds = userResumeVehiculos.map(r => r._id);
      const allUserResumeIds = [...userResumeIds, ...userResumeVehiculoIds];
      
      console.log('IDs de resumes del usuario (operadores):', userResumeIds);
      console.log('IDs de resumes vehículo del usuario:', userResumeVehiculoIds);
      console.log('Todos los IDs de resumes del usuario:', allUserResumeIds);

      // 2) Buscar TODAS las invitaciones en el sistema
      const allInvitaciones = await this.invitacionesModel
        .find({
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: '_id user_id nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      console.log('TODAS las invitaciones en el sistema:', allInvitaciones.length);

      // 3) Buscar invitaciones de operadores que coincidan con los resumes del usuario
      const invitacionesOperadores = await this.invitacionesModel
        .find({
          resume_operador_id: { $in: userResumeIds },
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_operador_id',
            select: '_id user_id nombre apellido razonsocial',
            model: 'Resume',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 4) Buscar invitaciones de vehículos que coincidan con los resumes vehículo del usuario
      const invitacionesVehiculos = await this.invitacionVehiculoModel
        .find({
          resume_vehiculo_id: { $in: userResumeVehiculoIds },
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_vehiculo_id',
            select: '_id user_id placa modelo',
            model: 'Resumevehiculo',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 5) Buscar invitaciones de ligadura que coincidan con los resumes vehículo del usuario
      const invitacionesLigadura = await this.ligarVehiculoModel
        .find({
          resume_vehiculo_id: { $in: userResumeVehiculoIds },
          status: true,
          deleted: false,
        })
        .populate([
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'usuario_a_ligar_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
          {
            path: 'resume_vehiculo_id',
            select: '_id user_id placa modelo',
            model: 'Resumevehiculo',
          },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 6) Combinar todas las invitaciones
      const invitacionesFiltradas = [...invitacionesOperadores, ...invitacionesVehiculos, ...invitacionesLigadura];

      console.log('Invitaciones de operadores:', invitacionesOperadores.length);
      console.log('Invitaciones de vehículos:', invitacionesVehiculos.length);
      console.log('Invitaciones de ligadura:', invitacionesLigadura.length);
      console.log('Total invitaciones filtradas:', invitacionesFiltradas.length);

      return {
        usuario_id: userId,
        resumes_del_usuario: userResumes.map(r => ({
          id: r._id,
          user_id: r.user_id,
          nombre: r.nombre,
          apellido: r.apellido
        })),
        total_invitaciones_sistema: allInvitaciones.length,
        invitaciones_filtradas: invitacionesFiltradas.length,
        todas_las_invitaciones: allInvitaciones.map(inv => ({
          id: inv._id,
          estado: inv.estado_invitacion,
          resume_id: inv.resume_operador_id?._id,
          resume_user_id: inv.resume_operador_id?.user_id,
          usuario_invitante: inv.usuario_invitante_id?.nombre
        })),
        invitaciones_del_usuario: invitacionesFiltradas.map(inv => ({
          id: inv._id,
          estado: inv.estado_invitacion,
          resume_id: (inv as any).resume_operador_id?._id || (inv as any).resume_vehiculo_id?._id,
          resume_user_id: (inv as any).resume_operador_id?.user_id || (inv as any).resume_vehiculo_id?.user_id,
          usuario_invitante: inv.usuario_invitante_id?.nombre
        }))
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  // MÉTODO TEMPORAL: Actualizar invitación con IDs válidos
  async fixInvitacionWithValidIds(invitacionId: string) {
    try {
      // Obtener el primer usuario válido
      const primerUsuario = await this.usuariosModel.findOne().select('_id');
      // Obtener el primer resume válido
      const primerResume = await this.resumeModel.findOne().select('_id');

      if (!primerUsuario || !primerResume) {
        throw new Error('No hay usuarios o resumes válidos en la BD');
      }

      const resultado = await this.invitacionesModel.findByIdAndUpdate(
        invitacionId,
        {
          usuario_invitante_id: primerUsuario._id,
          resume_operador_id: primerResume._id,
        },
        { new: true },
      );

      return resultado;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Invitación existe en bd ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `No se puede crear la invitación - Revisar logs del servidor`,
    );
  }
}
