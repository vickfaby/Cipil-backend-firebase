import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseService } from '../firebase/firebase.service';
import { Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly firebaseService: FirebaseService) {}
  async handleConnection(client: Socket) {
    Logger.log('🔥 Conexión establecida');
    const token = client.handshake.auth?.token;
    if (!token) {
      Logger.log('🔥 No se encontró token');
      client.disconnect();
      return;
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      this.onSubscribePerClient();
      Logger.log('🔥 Usuario autenticado:', decoded.email);
    } catch {
      Logger.log('🔥 Error al autenticar usuario');
      client.disconnect();
    }
  } 

  onSubscribePerClient() {
    Logger.log('🚀 WebSocket Gateway inicializado');
    //console.log('🚀 WebSocket Gateway inicializado');
    //console.log('🚀 WebSocket Gateway inicializado');

    // Escuchar cambios en la colección messages
    this.firebaseService.firestore
      .collection('ws-messages')
      .onSnapshot((snapshot) => {
        const changes = snapshot.docChanges();
        for (const change of changes) {
          if (change.type === 'added') {
            Logger.log('🔥 Nuevo mensaje recibido', change.doc.data());
            this.server.emit('newMessage', {
              id: change.doc.id,
              ...change.doc.data(),
            });
          }
        }
      });
  }
}
