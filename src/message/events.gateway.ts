import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseService } from 'src/firebase/firebase.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/api/v1/ws',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly firebaseService: FirebaseService) {}
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map();

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query?.token as string;

      if (!token) {
        Logger.log('❌ Cliente sin token--------------------------------');
        client.disconnect();
        return;
      }

      // 🔐 Verificar JWT con Firebase
      const decoded = await this.firebaseService.getAuth().verifyIdToken(token);
      const email = decoded.email;

      if (!email) {
        Logger.log('❌ Token sin email');
        client.disconnect();
        return;
      }

      this.userSockets.set(email, client.id);
      console.log(`✅ ${email} conectado con socket ${client.id}`);
    } catch (error) {
      console.log('❌ Error de autenticación WebSocket:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [email, id] of this.userSockets.entries()) {
      if (id === client.id) {
        this.userSockets.delete(email);
        console.log(`🔌 Usuario ${email} desconectado`);
        break;
      }
    }
  }

  // 📢 Enviar mensaje a todos y guardarlo en Firestore
  @SubscribeMessage('sendMessageToAll')
  async handleBroadcast(
    @MessageBody()
    data: {
      senderEmail: string;
      message: string;
      timeOnlineInSeconds: number;
    },
  ) {
    const msg = {
      senderEmail: data.senderEmail,
      receiverEmail: null,
      message: data.message,
      isSeen: false,
      timestamp: new Date(),
      type: 'broadcast',
      timeOnlineInSeconds: data.timeOnlineInSeconds || 3600,
    };
    //Logger.log( {msg});
    await this.firebaseService
      .getFirestore()
      .collection('ws-messages')
      .add(msg);

    this.server.emit('messageToAll', msg);
  }

  // 💬 Enviar mensaje privado y guardarlo en Firestore
  @SubscribeMessage('sendMessageToUser')
  async handlePrivateMessage(
    @MessageBody()
    data: {
      senderEmail: string;
      receiverEmail: string;
      message: string;
    },
  ) {
    Logger.log( {data: data});
    const socketId = this.userSockets.get(data.receiverEmail);
    Logger.log({ userSockets: this.userSockets });
    Logger.log({ socketId: socketId });
    let senderEmail: string | null = null;
    this.userSockets.forEach((value, key) => {
      Logger.log({ key: key, value: value });
      if (value === socketId) {
        senderEmail = key;
      }
    });
    const msg = {
      senderEmail: data.senderEmail,
      receiverEmail: data.receiverEmail,
      message: data.message,
      isSeen: false,
      timestamp: new Date(),
      type: 'private',
      timeOnlineInSeconds: null,
    };
    Logger.log({ msg });
    await this.firebaseService
      .getFirestore()
      .collection('ws-messages')
      .add(msg);

    if (socketId) {
      this.server.to(socketId).emit('privateMessage', msg);
    }
  }
}
