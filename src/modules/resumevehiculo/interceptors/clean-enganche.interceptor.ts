import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CleanEngancheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    if (body && typeof body === 'object') {
      // Eliminar todas las propiedades que empiecen con "enganche_"
      const cleanedBody = { ...body };
      Object.keys(cleanedBody).forEach((key) => {
        if (key.startsWith('enganche_')) {
          delete cleanedBody[key];
        }
      });

      // Si existe el objeto enganche anidado, asegurarse de que esté bien formado
      if (cleanedBody.enganche && typeof cleanedBody.enganche === 'object') {
        // El objeto enganche ya está correcto, no hacer nada
      }

      request.body = cleanedBody;
    }

    return next.handle();
  }
}
