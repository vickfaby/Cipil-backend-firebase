import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  firestore: FirebaseFirestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
      );
      // Usa credenciales por variables de entorno si hay clave privada; si no, ADC
      const credential =
        clientEmail && privateKey
          ? admin.credential.cert({
              projectId: projectId || undefined,
              clientEmail,
              privateKey,
            })
          : admin.credential.applicationDefault();

      // Proveer explícitamente projectId para Firestore (incluye caso ADC)
      const appOptions: admin.AppOptions = { credential };
      if (projectId) {
        appOptions.projectId = projectId;
        if (!process.env.GOOGLE_CLOUD_PROJECT) {
          process.env.GOOGLE_CLOUD_PROJECT = projectId;
        }
      }

      admin.initializeApp(appOptions);
    }
    this.firestore = admin.firestore();
    Logger.log('🔥 Firebase conectado');
  }

  getFirestore(): FirebaseFirestore.Firestore {
    return admin.firestore();
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }
}
