import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateLigarVehiculoDto } from './dto/create-ligarvehiculo.dto';
import { UpdateLigarVehiculoDto } from './dto/update-ligarvehiculo.dto';
import { LigarVehiculo } from './entities/ligarvehiculo.entity';
import { EstadoInvitacion } from './entities/estado-invitacion.enum';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { Resumevehiculo } from '../resumevehiculo/entities/resumevehiculo.entity';
import { TipoRelacion } from './entities/tipo-relacion.enum';

@Injectable()
export class LigarvehiculoService {
  constructor(
    @InjectModel(LigarVehiculo.name)
    private readonly ligarVehiculoModel: ModelExt<LigarVehiculo>,
    @InjectModel(Usuarios.name)
    private readonly usuariosModel: ModelExt<Usuarios>,
    @InjectModel(Resumevehiculo.name)
    private readonly resumevehiculoModel: ModelExt<Resumevehiculo>,
  ) {}

  async create(createDto: CreateLigarVehiculoDto) {
    try {
      const doc = await this.ligarVehiculoModel.create(createDto);
      return doc;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(): Promise<any>;
  async findAll(tipoRelacion: TipoRelacion): Promise<any>;
  async findAll(tipoRelacion?: TipoRelacion) {
    try {
      const filter: any = { deleted: false };
      if (tipoRelacion) filter.tipo_relacion = tipoRelacion;
      return await this.ligarVehiculoModel
        .find(filter)
        .populate([
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
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
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
      return await this.ligarVehiculoModel
        .findById(id)
        .populate([
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
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
        ])
        .select('-__v -deleted')
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuario(usuarioId: string): Promise<any>;
  async findByUsuario(usuarioId: string, tipoRelacion: TipoRelacion): Promise<any>;
  async findByUsuario(usuarioId: string, tipoRelacion?: TipoRelacion) {
    try {
      const filter: any = {
        usuario_a_ligar_id: usuarioId,
        deleted: false,
      };
      if (tipoRelacion) filter.tipo_relacion = tipoRelacion;
      return await this.ligarVehiculoModel
        .find(filter)
        .populate([
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
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
        ])
        .select('-__v -deleted')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByResume(resumeId: string): Promise<any>;
  async findByResume(resumeId: string, tipoRelacion: TipoRelacion): Promise<any>;
  async findByResume(resumeId: string, tipoRelacion?: TipoRelacion) {
    try {
      const filter: any = {
        resume_vehiculo_id: resumeId,
        deleted: false,
      };
      if (tipoRelacion) filter.tipo_relacion = tipoRelacion;
      return await this.ligarVehiculoModel
        .find(filter)
        .populate([
          {
            path: 'usuario_a_ligar_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
        ])
        .select('-__v -deleted')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByInvitante(usuarioId: string): Promise<any>;
  async findByInvitante(usuarioId: string, tipoRelacion: TipoRelacion): Promise<any>;
  async findByInvitante(usuarioId: string, tipoRelacion?: TipoRelacion) {
    try {
      const filter: any = {
        usuario_invitante_id: usuarioId,
        deleted: false,
      };
      if (tipoRelacion) filter.tipo_relacion = tipoRelacion;
      return await this.ligarVehiculoModel
        .find(filter)
        .populate([
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
          {
            path: 'usuario_invitante_id',
            select: 'nombre correo',
            model: 'Usuarios',
          },
        ])
        .select('-__v -deleted')
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateDto: Partial<UpdateLigarVehiculoDto>) {
    const doc = await this.findOne(id);
    try {
      if (!doc) {
        throw new BadRequestException('Liga vehículo no encontrada');
      }
      await doc.updateOne(updateDto);
      return { ...doc.toJSON(), ...updateDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async acceptInvitation(id: string) {
    try {
      const updateData = {
        estado_invitacion: EstadoInvitacion.ACEPTADA,
        fecha_respuesta: new Date(),
      };
      return await this.update(id, updateData);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async rejectInvitation(id: string) {
    try {
      const updateData = {
        estado_invitacion: EstadoInvitacion.RECHAZADA,
        fecha_respuesta: new Date(),
      };
      return await this.update(id, updateData);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async cancelInvitation(id: string) {
    try {
      const updateData = {
        estado_invitacion: EstadoInvitacion.CANCELADA,
        fecha_respuesta: new Date(),
      };
      return await this.update(id, updateData);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const _id = new Types.ObjectId(id);
    const resp = this.ligarVehiculoModel.delete({ _id });
    return resp;
  }

  async findResumeWithLigarsByUser(userId: string, pagination: any) {
    try {
      const summarySelect =
        'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placa_enganche progreso user_id status tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';

      // 1) Obtener ligas que cumplan con el usuario y TODOS los estados
      const ligars = await this.ligarVehiculoModel
        .find({
          usuario_a_ligar_id: userId,
          // Removemos el filtro de estado para incluir todos los estados
          status: true,
          deleted: false,
        })
        .populate([
          { path: 'usuario_a_ligar_id', select: 'nombre correo', model: 'Usuarios' },
          { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
          { path: 'resume_vehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      // 2) Extraer los IDs de resume a partir de las ligas
      const resumeIdSet = new Set<string>();
      for (const item of ligars) {
        const id = (item as any).resume_vehiculo_id && (item as any).resume_vehiculo_id._id
          ? String((item as any).resume_vehiculo_id._id)
          : String((item as any).resume_vehiculo_id);
        if (id) resumeIdSet.add(id);
      }
      const resumeIds = Array.from(resumeIdSet);

      // 3) Buscar SOLO los resumevehiculo que tienen ligas del usuario (sin paginación por ahora)
      const resumeDocs = await this.resumevehiculoModel
        .find({ _id: { $in: resumeIds }, status: true })
        .select(summarySelect)
        .sort({ createdAt: -1 })
        .exec();

      const resumeIdToLigars: Record<string, any[]> = {};
      for (const item of ligars) {
        const populatedId = (item as any).resume_vehiculo_id && (item as any).resume_vehiculo_id._id
          ? String((item as any).resume_vehiculo_id._id)
          : String((item as any).resume_vehiculo_id);
        if (!resumeIdToLigars[populatedId]) resumeIdToLigars[populatedId] = [];
        resumeIdToLigars[populatedId].push(item);
      }

      const docsWithLigars = resumeDocs.map((r: any) => {
        const rid = String(r._id);
        return {
          ...(r.toObject ? r.toObject() : r),
          invitaciones: resumeIdToLigars[rid] || [],
        };
      });

      // Aplicar paginación manual
      const totalDocs = docsWithLigars.length;
      const totalPages = Math.ceil(totalDocs / (pagination.limit || 10));
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocs = docsWithLigars.slice(startIndex, endIndex);

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

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Registro existe en bd ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `No se puede procesar la solicitud - Revisar logs del servidor`,
    );
  }
}


