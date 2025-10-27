import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { ModelExt } from 'src/common/interfaces/interfaces';

import { CreateInvitacionVehiculoDto } from './dto/create-invitacionvehiculo.dto';
import { UpdateInvitacionVehiculoDto } from './dto/update-invitacionvehiculo.dto';
import { InvitacionVehiculo } from './entities/invitacionvehiculo.entity';
import { EstadoInvitacion } from './entities/estado-invitacion.enum';
import { Usuarios } from '../usuarios/entities/usuarios.entity';
import { Resumevehiculo } from '../resumevehiculo/entities/resumevehiculo.entity';

@Injectable()
export class InvitacionvehiculoService {
  constructor(
    @InjectModel(InvitacionVehiculo.name)
    private readonly invitacionVehiculoModel: ModelExt<InvitacionVehiculo>,
    @InjectModel(Usuarios.name)
    private readonly usuariosModel: ModelExt<Usuarios>,
    @InjectModel(Resumevehiculo.name)
    private readonly resumevehiculoModel: ModelExt<Resumevehiculo>,
  ) {}

  async create(createDto: CreateInvitacionVehiculoDto) {
    try {
      const doc = await this.invitacionVehiculoModel.create(createDto);
      return doc;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.invitacionVehiculoModel
        .find({ deleted: false })
        .populate([
          { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
          { path: 'resume_vehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
        ])
        .select('-__v -deleted')
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.invitacionVehiculoModel
        .findById(id)
        .populate([
          { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
          { path: 'resume_vehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
        ])
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByUsuario(usuarioId: string) {
    try {
      return await this.invitacionVehiculoModel
        .find({ usuario_invitante_id: usuarioId, deleted: false })
        .populate([
          { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
          { path: 'resume_vehiculo_id', select: 'placa modelo', model: 'Resumevehiculo' },
        ])
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findByResume(resumeId: string) {
    try {
      return await this.invitacionVehiculoModel
        .find({ resume_vehiculo_id: resumeId, deleted: false })
        .populate([
          { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
        ])
        .sort({ createdAt: -1 })
        .exec();
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateDto: UpdateInvitacionVehiculoDto) {
    const doc = await this.findOne(id);
    try {
      if (!doc) {
        throw new BadRequestException('Invitación de vehículo no encontrada');
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
    const resp = this.invitacionVehiculoModel.delete({ _id });
    return resp;
  }

  async findResumeWithInvitationsByUser(userId: string, pagination: any) {
    try {
      const summarySelect =
        'placa modelo tipovehiculo_id marca_id ano_id modelo_id color_id tipocarroceria_id clasevehiculo_id propietario_id tenedor_id operador_id tipo_servicio empresagps_id ubicacion calificacion ruta_frecuente placa_enganche progreso user_id status tipo_doc_propietario_id num_documento_propietario email_propietario tipo_doc_tenedor_id num_documento_tenedor email_tenedor tipo_doc_operador_id num_documento_operador email_operador tenedor_liga_id propietario_liga_id operador_liga_id';

      // Buscar resumes de vehículos del usuario (sin paginación por ahora)
      const resumeDocs = await this.resumevehiculoModel
        .find({ user_id: userId, status: true })
        .select(summarySelect)
        .sort({ createdAt: -1 })
        .populate([
          { path: 'tipo_doc_propietario_id', select: 'nombre_tipodocumento' },
          { path: 'tipo_doc_tenedor_id', select: 'nombre_tipodocumento' },
          { path: 'tipo_doc_operador_id', select: 'nombre_tipodocumento' },
          { path: 'tenedor_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          { path: 'propietario_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
          { path: 'operador_liga_id', select: 'usuario_a_ligar_id correo_a_ligar estado_invitacion' },
        ])
        .exec();

      const resumeIds = resumeDocs.map((r: any) => r._id);

      const invitaciones = await this.invitacionVehiculoModel
        .find({
          resume_vehiculo_id: { $in: resumeIds },
          // Removemos el filtro de estado para incluir todos los estados
          status: true,
          deleted: false,
        })
        .populate([
          { path: 'usuario_invitante_id', select: 'nombre correo', model: 'Usuarios' },
        ])
        .sort({ createdAt: -1 })
        .select('-__v -deleted')
        .exec();

      const resumeIdToInvitaciones: Record<string, any[]> = {};
      for (const inv of invitaciones) {
        const key = String(inv.resume_vehiculo_id);
        if (!resumeIdToInvitaciones[key]) resumeIdToInvitaciones[key] = [];
        resumeIdToInvitaciones[key].push(inv);
      }

      const docsWithInvitations = resumeDocs.map((r: any) => ({
        ...(r.toObject ? r.toObject() : r),
        invitaciones: resumeIdToInvitaciones[String(r._id)] || [],
      }));

      // Aplicar paginación manual
      const totalDocs = docsWithInvitations.length;
      const totalPages = Math.ceil(totalDocs / (pagination.limit || 10));
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDocs = docsWithInvitations.slice(startIndex, endIndex);

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


