import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLogimpresionesDto } from './dto/create-logimpresiones.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logimpresiones } from './entities/logimpresiones.entity';

@Injectable()
export class LogimpresionesService {
  constructor(
    @InjectModel(Logimpresiones.name)
    private readonly logimpresionesModel: Model<Logimpresiones>,
  ) {}

  async create(createLogimpresioneDto: CreateLogimpresionesDto) {
    try {
      const logimpresiones = await this.logimpresionesModel.create(
        createLogimpresioneDto,
      );
      return logimpresiones;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    try {
      const logimpresiones = await this.logimpresionesModel.find({}).lean();
      return logimpresiones;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findOneResume(resume_id: string) {
    try {
      const logimpresionesResume = await this.logimpresionesModel
        .find({
          resume_id: resume_id,
        })
        .sort({ _id: -1 })
        .limit(1)
        .select('fecha_impresion');
      return logimpresionesResume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  async findOneResumeVehicle(resumevehiculo_id: string) {
    try {
      const logimpresionesResume = await this.logimpresionesModel
        .find({
          resumevehiculo_id: resumevehiculo_id,
        })
        .sort({ _id: -1 })
        .limit(1)
        .select('fecha_impresion');
      return logimpresionesResume;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `logimpresiones exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create logimpresiones - Check server logs`,
    );
  }
}
