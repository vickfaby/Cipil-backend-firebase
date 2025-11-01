import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as admin from 'firebase-admin';

type WsMessage = {
  id: string;
  senderEmail?: string;
  receiverEmail?: string | null;
  message?: string;
  isSeen?: boolean;
  timestamp?: unknown;
  type?: string;
  timeOnlineInSeconds?: number | null;
  url?: string | null;
  notificationType?: string | null;
  utilId?: string | null;
  notificationDescription?: string | null;
};

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

  private getTimestampMs(ts: unknown): number {
    if (
      ts &&
      typeof ts === 'object' &&
      'toMillis' in (ts as Record<string, unknown>) &&
      typeof (ts as { toMillis: () => number }).toMillis === 'function'
    ) {
      return (ts as { toMillis: () => number }).toMillis();
    }
    if (ts instanceof Date) return ts.getTime();
    if (typeof ts === 'number') return ts;
    if (typeof ts === 'string') {
      const ms = Date.parse(ts);
      return Number.isNaN(ms) ? 0 : ms;
    }
    return 0;
  }

  private extractMessage(id: string, raw: Record<string, unknown>): WsMessage {
    const senderEmail = raw['senderEmail'];
    const receiverEmail = raw['receiverEmail'];
    const message = raw['message'];
    const isSeen = raw['isSeen'];
    const timestamp = raw['timestamp'];
    const type = raw['type'];
    const timeOnlineInSeconds = raw['timeOnlineInSeconds'];
    const url = raw['url'];
    const notificationType = raw['notificationType'];
    const utilId = raw['utilId'];
    const notificationDescription = raw['notificationDescription'];
    return {
      id,
      senderEmail: typeof senderEmail === 'string' ? senderEmail : undefined,
      receiverEmail: typeof receiverEmail === 'string' ? receiverEmail : null,
      message: typeof message === 'string' ? message : undefined,
      isSeen: typeof isSeen === 'boolean' ? isSeen : undefined,
      timestamp: timestamp,
      type: typeof type === 'string' ? type : undefined,
      timeOnlineInSeconds:
        typeof timeOnlineInSeconds === 'number' ? timeOnlineInSeconds : null,
      url: typeof url === 'string' ? url : null,
      notificationType:
        typeof notificationType === 'string' ? notificationType : null,
      utilId: typeof utilId === 'string' ? utilId : null,
      notificationDescription:
        typeof notificationDescription === 'string'
          ? notificationDescription
          : null,
    };
  }

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
      console.log('❌ Error de autenticación WebSocket:', String(error));
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
      url?: string;
      notificationType?: string;
      utilId?: string;
      notificationDescription?: string;
    },
  ) {
    const msg = {
      senderEmail: data.senderEmail,
      receiverEmail: null,
      message: data.message,
      isSeen: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      type: 'broadcast',
      timeOnlineInSeconds: data.timeOnlineInSeconds || 3600,
      url: data.url || null,
      notificationType: data.notificationType || null,
      utilId: data.utilId || null,
      notificationDescription: data.notificationDescription || null,
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
      url?: string;
      notificationType?: string;
      utilId?: string;
      notificationDescription?: string;
    },
  ) {
    Logger.log({ data: data });
    const socketId = this.userSockets.get(data.receiverEmail);
    Logger.log({ userSockets: this.userSockets });
    Logger.log({ socketId: socketId });
    const msg = {
      senderEmail: data.senderEmail,
      receiverEmail: data.receiverEmail,
      message: data.message,
      isSeen: false,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      type: 'private',
      timeOnlineInSeconds: null,
      url: data.url || null,
      notificationType: data.notificationType || null,
      utilId: data.utilId || null,
      notificationDescription: data.notificationDescription || null,
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

  // 📥 Listar mensajes por usuario (sin filtrar por isSeen)
  @SubscribeMessage('listMessagesByUser')
  async listMessagesByUser(
    @MessageBody()
    data: {
      receiverEmail: string;
      limit?: number;
      includeBroadcast?: boolean; // incluir mensajes de tipo broadcast
    },
  ) {
    const db = this.firebaseService.getFirestore();
    const limit = Number(data?.limit) || 50;
    const includeBroadcast = Boolean(data?.includeBroadcast);

    // Obtener privados del usuario (sin isSeen)
    const privateSnap = await db
      .collection('ws-messages')
      .where('receiverEmail', '==', data.receiverEmail)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get()
      .catch(async () => {
        // Si no existe índice para orderBy, hacemos fallback sin order y ordenamos en memoria
        const s = await db
          .collection('ws-messages')
          .where('receiverEmail', '==', data.receiverEmail)
          .limit(limit)
          .get();
        return s;
      });
    let docs: WsMessage[] = privateSnap.docs.map((d) =>
      this.extractMessage(d.id, d.data() as Record<string, unknown>),
    );

    // Incluir broadcasts si se solicita
    if (includeBroadcast) {
      const broadcastSnap = await db
        .collection('ws-messages')
        .where('type', '==', 'broadcast')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get()
        .catch(async () => {
          const s = await db
            .collection('ws-messages')
            .where('type', '==', 'broadcast')
            .limit(limit)
            .get();
          return s;
        });

      const broadcasts: WsMessage[] = broadcastSnap.docs.map((d) =>
        this.extractMessage(d.id, d.data() as Record<string, unknown>),
      );

      docs = docs.concat(broadcasts);
    }

    // Ordenar por timestamp desc en memoria y truncar a limit
    docs.sort(
      (a, b) =>
        this.getTimestampMs(b?.timestamp) - this.getTimestampMs(a?.timestamp),
    );
    docs = docs.slice(0, limit);

    return {
      docs,
      total: docs.length,
    };
  }

  // 🗑️ Eliminar un mensaje/notificación
  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody()
    data: {
      messageId: string;
      userEmail: string;
    },
  ) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection('ws-messages').doc(data.messageId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return {
          success: false,
          error: 'Mensaje no encontrado',
        };
      }

      const msgData = doc.data();

      // Validar que el usuario puede eliminar este mensaje
      // Puede eliminar si: es el receptor o es un broadcast
      if (
        msgData?.receiverEmail !== data.userEmail &&
        msgData?.type !== 'broadcast'
      ) {
        return {
          success: false,
          error: 'No autorizado para eliminar este mensaje',
        };
      }

      await docRef.delete();

      return {
        success: true,
        messageId: data.messageId,
      };
    } catch (error) {
      Logger.error('Error eliminando mensaje:', error);
      return {
        success: false,
        error: 'Error al eliminar el mensaje',
      };
    }
  }

  // ✅ Marcar mensaje como leído
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody()
    data: {
      messageId: string;
      userEmail: string;
    },
  ) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection('ws-messages').doc(data.messageId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return {
          success: false,
          error: 'Mensaje no encontrado',
        };
      }

      const msgData = doc.data();

      // Validar que el usuario puede marcar como leído
      if (
        msgData?.receiverEmail !== data.userEmail &&
        msgData?.type !== 'broadcast'
      ) {
        return {
          success: false,
          error: 'No autorizado para modificar este mensaje',
        };
      }

      await docRef.update({
        isSeen: true,
      });

      return {
        success: true,
        messageId: data.messageId,
      };
    } catch (error) {
      Logger.error('Error marcando mensaje como leído:', error);
      return {
        success: false,
        error: 'Error al marcar el mensaje como leído',
      };
    }
  }

  // ✅ Marcar múltiples mensajes como leídos
  @SubscribeMessage('markMultipleAsRead')
  async handleMarkMultipleAsRead(
    @MessageBody()
    data: {
      messageIds: string[];
      userEmail: string;
    },
  ) {
    try {
      const db = this.firebaseService.getFirestore();
      const batch = db.batch();
      let updated = 0;
      let errors = 0;

      for (const messageId of data.messageIds) {
        try {
          const docRef = db.collection('ws-messages').doc(messageId);
          const doc = await docRef.get();

          if (doc.exists) {
            const msgData = doc.data();
            // Solo actualizar si el usuario está autorizado
            if (
              msgData?.receiverEmail === data.userEmail ||
              msgData?.type === 'broadcast'
            ) {
              batch.update(docRef, { isSeen: true });
              updated++;
            }
          }
        } catch {
          errors++;
        }
      }

      await batch.commit();

      return {
        success: true,
        updated,
        errors,
        total: data.messageIds.length,
      };
    } catch (error) {
      Logger.error('Error marcando múltiples mensajes:', error);
      return {
        success: false,
        error: 'Error al marcar los mensajes como leídos',
      };
    }
  }
}
