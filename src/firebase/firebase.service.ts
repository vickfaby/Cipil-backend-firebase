import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  firestore: FirebaseFirestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      const credential = projectId && clientEmail && privateKey
        ? admin.credential.cert({ projectId, clientEmail, privateKey })
        : admin.credential.applicationDefault();

      admin.initializeApp({ credential });
    }
    this.firestore = admin.firestore();
    Logger.log('🔥 Firebase conectado');
  }
}
