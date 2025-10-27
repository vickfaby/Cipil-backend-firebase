import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  firestore: FirebaseFirestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          require('../ws-demo-5873d-firebase-adminsdk-fbsvc-98b1752bc7.json'),
        ),
      });
    }
    this.firestore = admin.firestore();
    Logger.log('🔥 Firebase conectado');
  }
}
