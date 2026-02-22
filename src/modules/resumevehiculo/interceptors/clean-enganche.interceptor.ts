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

      // Aceptar enganches (array). Eliminar clave legacy enganche si existe para evitar confusión.
      if (cleanedBody.enganche !== undefined) {
        delete cleanedBody.enganche;
      }
      if (cleanedBody.enganches && Array.isArray(cleanedBody.enganches)) {
        // Array de enganches ya correcto
      }

      request.body = cleanedBody;
    }

    return next.handle();
  }
}
