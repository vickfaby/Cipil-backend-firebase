# 📬 Guía de Implementación de Notificaciones en el Frontend

Esta guía te ayudará a integrar el sistema de notificaciones WebSocket en tu aplicación frontend.

---

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Configuración Inicial](#configuración-inicial)
- [Eventos Disponibles](#eventos-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Integración con Angular](#integración-con-angular)
- [Integración con React](#integración-con-react)
- [Estructura de Datos](#estructura-de-datos)
- [Buenas Prácticas](#buenas-prácticas)

---

## 🔧 Instalación

### Para Angular
```bash
npm install socket.io-client
```

### Para React
```bash
npm install socket.io-client
```

---

## ⚙️ Configuración Inicial

### Conectar al servidor WebSocket

```typescript
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('https://tu-backend.com/api/v1/ws', {
  query: {
    token: 'TU_FIREBASE_JWT_TOKEN' // Token de autenticación de Firebase
  },
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Escuchar eventos de conexión
socket.on('connect', () => {
  console.log('✅ Conectado al servidor de notificaciones');
});

socket.on('disconnect', () => {
  console.log('🔌 Desconectado del servidor');
});

socket.on('connect_error', (error) => {
  console.error('❌ Error de conexión:', error);
});
```

---

## 📡 Eventos Disponibles

### 1️⃣ **Enviar Notificación Broadcast** (`sendMessageToAll`)

Envía una notificación a todos los usuarios conectados.

```typescript
socket.emit('sendMessageToAll', {
  senderEmail: 'admin@ejemplo.com',
  message: 'Mantenimiento programado esta noche',
  timeOnlineInSeconds: 3600,
  url: 'https://tuapp.com/mantenimiento',
  notificationType: 'SYSTEM_ALERT',
  utilId: 'MAINT-2025-001',
  notificationDescription: 'El sistema estará en mantenimiento de 2am a 4am'
});
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `senderEmail` | `string` | ✅ Sí | Email del remitente |
| `message` | `string` | ✅ Sí | Mensaje de la notificación |
| `timeOnlineInSeconds` | `number` | ✅ Sí | Tiempo de visibilidad (segundos) |
| `url` | `string` | ❌ No | URL de acción opcional |
| `notificationType` | `string` | ❌ No | Tipo de notificación |
| `utilId` | `string` | ❌ No | ID útil relacionado |
| `notificationDescription` | `string` | ❌ No | Descripción adicional |

---

### 2️⃣ **Enviar Notificación Privada** (`sendMessageToUser`)

Envía una notificación a un usuario específico.

```typescript
socket.emit('sendMessageToUser', {
  senderEmail: 'operador@ejemplo.com',
  receiverEmail: 'conductor@ejemplo.com',
  message: 'Nueva invitación de vehículo',
  url: '/invitaciones/VEH-12345',
  notificationType: 'VEHICLE_INVITATION',
  utilId: 'INV-98765',
  notificationDescription: 'Se te ha asignado un nuevo vehículo'
});
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `senderEmail` | `string` | ✅ Sí | Email del remitente |
| `receiverEmail` | `string` | ✅ Sí | Email del destinatario |
| `message` | `string` | ✅ Sí | Mensaje de la notificación |
| `url` | `string` | ❌ No | URL de acción opcional |
| `notificationType` | `string` | ❌ No | Tipo de notificación |
| `utilId` | `string` | ❌ No | ID útil relacionado |
| `notificationDescription` | `string` | ❌ No | Descripción adicional |

---

### 3️⃣ **Listar Notificaciones** (`listMessagesByUser`)

Obtiene todas las notificaciones de un usuario (incluye leídas y no leídas).

```typescript
socket.emit('listMessagesByUser', {
  receiverEmail: 'usuario@ejemplo.com',
  limit: 50,
  includeBroadcast: true
}, (response) => {
  console.log('📨 Notificaciones:', response.docs);
  console.log('📊 Total:', response.total);
  
  // Procesar notificaciones
  response.docs.forEach(notification => {
    console.log(notification.message);
  });
});
```

**Parámetros:**
| Campo | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `receiverEmail` | `string` | ✅ Sí | - | Email del usuario |
| `limit` | `number` | ❌ No | `50` | Cantidad máxima |
| `includeBroadcast` | `boolean` | ❌ No | `false` | Incluir broadcasts |

**Respuesta:**
```typescript
{
  docs: WsMessage[],  // Array de notificaciones
  total: number       // Total de notificaciones
}
```

---

### 4️⃣ **Eliminar Notificación** (`deleteMessage`) ⭐ NUEVO

Elimina permanentemente una notificación.

```typescript
socket.emit('deleteMessage', {
  messageId: 'abc123xyz',
  userEmail: 'usuario@ejemplo.com'
}, (response) => {
  if (response.success) {
    console.log('✅ Notificación eliminada');
  } else {
    console.error('❌ Error:', response.error);
  }
});
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `messageId` | `string` | ✅ Sí | ID del mensaje de Firestore |
| `userEmail` | `string` | ✅ Sí | Email del usuario actual |

**Respuesta:**
```typescript
{
  success: boolean;
  messageId?: string;  // ID del mensaje eliminado
  error?: string;      // Mensaje de error si falla
}
```

**Seguridad:**
- ✅ Solo puedes eliminar tus propias notificaciones privadas
- ✅ Los broadcasts pueden ser eliminados por cualquier usuario

---

### 5️⃣ **Marcar como Leída** (`markAsRead`) ⭐ NUEVO

Marca una notificación como leída (`isSeen: true`).

```typescript
socket.emit('markAsRead', {
  messageId: 'abc123xyz',
  userEmail: 'usuario@ejemplo.com'
}, (response) => {
  if (response.success) {
    console.log('✅ Marcada como leída');
  } else {
    console.error('❌ Error:', response.error);
  }
});
```

**Respuesta:**
```typescript
{
  success: boolean;
  messageId?: string;
  error?: string;
}
```

---

### 6️⃣ **Marcar Múltiples como Leídas** (`markMultipleAsRead`) ⭐ NUEVO

Marca varias notificaciones como leídas de una sola vez.

```typescript
socket.emit('markMultipleAsRead', {
  messageIds: ['id1', 'id2', 'id3', 'id4'],
  userEmail: 'usuario@ejemplo.com'
}, (response) => {
  if (response.success) {
    console.log(`✅ ${response.updated} notificaciones marcadas`);
    console.log(`❌ ${response.errors} errores`);
  }
});
```

**Respuesta:**
```typescript
{
  success: boolean;
  updated?: number;   // Cantidad actualizada con éxito
  errors?: number;    // Cantidad de errores
  total?: number;     // Total de IDs enviados
  error?: string;
}
```

---

## 📦 Estructura de Datos

### Objeto `WsMessage` (Notificación)

```typescript
interface WsMessage {
  id: string;                          // ID del documento en Firestore
  senderEmail?: string;                // Email del remitente
  receiverEmail?: string | null;       // Email del destinatario (null para broadcasts)
  message?: string;                    // Contenido del mensaje
  isSeen?: boolean;                    // Estado de lectura
  timestamp?: any;                     // Fecha de creación (Firestore Timestamp)
  type?: string;                       // 'private' | 'broadcast'
  timeOnlineInSeconds?: number | null; // Duración de visibilidad
  url?: string | null;                 // URL de acción
  notificationType?: string | null;    // Tipo de notificación
  utilId?: string | null;              // ID relacionado (invitación, operador, etc.)
  notificationDescription?: string | null; // Descripción adicional
}
```

---

## 🎯 Ejemplos de Uso Completos

### Angular Service Completo

```typescript
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WsMessage {
  id: string;
  senderEmail?: string;
  receiverEmail?: string | null;
  message?: string;
  isSeen?: boolean;
  timestamp?: any;
  type?: string;
  timeOnlineInSeconds?: number | null;
  url?: string | null;
  notificationType?: string | null;
  utilId?: string | null;
  notificationDescription?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private notificationsSubject = new BehaviorSubject<WsMessage[]>([]);
  public notifications$: Observable<WsMessage[]> = this.notificationsSubject.asObservable();
  
  private userEmail: string = '';

  constructor() {
    // Inicializar socket (obtener token de tu servicio de auth)
    const token = localStorage.getItem('firebaseToken');
    
    this.socket = io('https://tu-backend.com/api/v1/ws', {
      query: { token },
      transports: ['websocket'],
      reconnection: true
    });

    this.setupListeners();
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    this.loadNotifications();
  }

  private setupListeners() {
    // Escuchar nuevas notificaciones privadas
    this.socket.on('privateMessage', (msg: WsMessage) => {
      console.log('📨 Nueva notificación privada:', msg);
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([msg, ...current]);
    });

    // Escuchar broadcasts
    this.socket.on('messageToAll', (msg: WsMessage) => {
      console.log('📢 Nueva notificación broadcast:', msg);
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([msg, ...current]);
    });
  }

  loadNotifications(limit: number = 50, includeBroadcast: boolean = true): Promise<any> {
    return new Promise((resolve) => {
      this.socket.emit('listMessagesByUser', {
        receiverEmail: this.userEmail,
        limit,
        includeBroadcast
      }, (response: { docs: WsMessage[], total: number }) => {
        this.notificationsSubject.next(response.docs);
        resolve(response);
      });
    });
  }

  deleteNotification(messageId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      this.socket.emit('deleteMessage', {
        messageId,
        userEmail: this.userEmail
      }, (response) => {
        if (response.success) {
          // Actualizar el estado local
          const current = this.notificationsSubject.value;
          this.notificationsSubject.next(current.filter(n => n.id !== messageId));
        }
        resolve(response);
      });
    });
  }

  markAsRead(messageId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      this.socket.emit('markAsRead', {
        messageId,
        userEmail: this.userEmail
      }, (response) => {
        if (response.success) {
          // Actualizar el estado local
          const current = this.notificationsSubject.value;
          const updated = current.map(n => 
            n.id === messageId ? { ...n, isSeen: true } : n
          );
          this.notificationsSubject.next(updated);
        }
        resolve(response);
      });
    });
  }

  markAllAsRead(): Promise<any> {
    return new Promise((resolve) => {
      const current = this.notificationsSubject.value;
      const unreadIds = current.filter(n => !n.isSeen).map(n => n.id);

      if (unreadIds.length === 0) {
        resolve({ success: true, updated: 0 });
        return;
      }

      this.socket.emit('markMultipleAsRead', {
        messageIds: unreadIds,
        userEmail: this.userEmail
      }, (response) => {
        if (response.success) {
          // Actualizar todas como leídas
          const updated = current.map(n => ({ ...n, isSeen: true }));
          this.notificationsSubject.next(updated);
        }
        resolve(response);
      });
    });
  }

  sendPrivateMessage(receiverEmail: string, message: string, options?: {
    url?: string;
    notificationType?: string;
    utilId?: string;
    notificationDescription?: string;
  }) {
    this.socket.emit('sendMessageToUser', {
      senderEmail: this.userEmail,
      receiverEmail,
      message,
      url: options?.url,
      notificationType: options?.notificationType,
      utilId: options?.utilId,
      notificationDescription: options?.notificationDescription
    });
  }

  getUnreadCount(): number {
    return this.notificationsSubject.value.filter(n => !n.isSeen).length;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
```

---

## 🎨 Integración con Angular

### 1. Crear el Servicio

Crea `src/app/services/notification.service.ts` con el código del ejemplo anterior.

### 2. Crear el Componente de Notificaciones

```typescript
// notifications.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, WsMessage } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: WsMessage[] = [];
  unreadCount: number = 0;
  loading: boolean = false;
  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Configurar email del usuario
    const userEmail = this.authService.getUserEmail();
    this.notificationService.setUserEmail(userEmail);

    // Suscribirse a cambios de notificaciones
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
        this.updateUnreadCount();
      }
    );

    // Cargar notificaciones iniciales
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async loadNotifications() {
    this.loading = true;
    try {
      await this.notificationService.loadNotifications(50, true);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      this.loading = false;
    }
  }

  async deleteNotification(notification: WsMessage) {
    const result = await this.notificationService.deleteNotification(notification.id);
    
    if (result.success) {
      console.log('✅ Notificación eliminada');
      // La UI se actualiza automáticamente vía Observable
    } else {
      alert(`Error: ${result.error}`);
    }
  }

  async markAsRead(notification: WsMessage) {
    if (notification.isSeen) return; // Ya está leída

    const result = await this.notificationService.markAsRead(notification.id);
    
    if (!result.success) {
      console.error('Error marcando como leída:', result.error);
    }
  }

  async markAllAsRead() {
    const result = await this.notificationService.markAllAsRead();
    
    if (result.success) {
      console.log(`✅ ${result.updated} notificaciones marcadas como leídas`);
    }
  }

  onNotificationClick(notification: WsMessage) {
    // Marcar como leída al hacer click
    this.markAsRead(notification);

    // Navegar a la URL si existe
    if (notification.url) {
      // Usar tu router para navegar
      // this.router.navigate([notification.url]);
      window.location.href = notification.url;
    }
  }

  private updateUnreadCount() {
    this.unreadCount = this.notificationService.getUnreadCount();
  }

  getNotificationIcon(type?: string | null): string {
    switch(type) {
      case 'VEHICLE_INVITATION': return '🚗';
      case 'OPERATOR_INVITATION': return '👤';
      case 'SYSTEM_ALERT': return '⚠️';
      case 'MESSAGE': return '💬';
      default: return '🔔';
    }
  }
}
```

### 3. Template HTML

```html
<!-- notifications.component.html -->
<div class="notifications-container">
  <div class="notifications-header">
    <h2>Notificaciones</h2>
    <span class="badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
    <button (click)="markAllAsRead()" [disabled]="unreadCount === 0">
      Marcar todas como leídas
    </button>
  </div>

  <div class="notifications-list" *ngIf="!loading; else loadingTemplate">
    <div 
      *ngFor="let notification of notifications"
      class="notification-item"
      [class.unread]="!notification.isSeen"
      (click)="onNotificationClick(notification)"
    >
      <div class="notification-icon">
        {{ getNotificationIcon(notification.notificationType) }}
      </div>
      
      <div class="notification-content">
        <div class="notification-header">
          <span class="notification-title">{{ notification.message }}</span>
          <span class="notification-time">
            {{ notification.timestamp | date: 'short' }}
          </span>
        </div>
        
        <p class="notification-description" *ngIf="notification.notificationDescription">
          {{ notification.notificationDescription }}
        </p>
        
        <div class="notification-meta">
          <span class="notification-type">{{ notification.notificationType }}</span>
          <span class="notification-sender" *ngIf="notification.senderEmail">
            De: {{ notification.senderEmail }}
          </span>
        </div>
      </div>

      <div class="notification-actions">
        <button 
          (click)="markAsRead(notification); $event.stopPropagation()"
          *ngIf="!notification.isSeen"
          class="btn-read"
          title="Marcar como leída"
        >
          ✓
        </button>
        
        <button 
          (click)="deleteNotification(notification); $event.stopPropagation()"
          class="btn-delete"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>

    <div *ngIf="notifications.length === 0" class="no-notifications">
      <p>No tienes notificaciones</p>
    </div>
  </div>

  <ng-template #loadingTemplate>
    <div class="loading">Cargando notificaciones...</div>
  </ng-template>
</div>
```

### 4. Estilos SCSS

```scss
// notifications.component.scss
.notifications-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  .notifications-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      flex: 1;
    }

    .badge {
      background: #ff4444;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }

    button {
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }

  .notifications-list {
    .notification-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      margin-bottom: 8px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      &.unread {
        background: #f0f8ff;
        border-left: 4px solid #2196F3;
        font-weight: 500;
      }

      .notification-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .notification-content {
        flex: 1;

        .notification-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;

          .notification-title {
            font-weight: 500;
          }

          .notification-time {
            font-size: 12px;
            color: #666;
          }
        }

        .notification-description {
          font-size: 14px;
          color: #555;
          margin: 4px 0;
        }

        .notification-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #888;
          margin-top: 8px;
        }
      }

      .notification-actions {
        display: flex;
        gap: 8px;
        align-items: center;

        button {
          padding: 4px 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          border-radius: 4px;
          transition: background 0.2s;

          &:hover {
            background: #f0f0f0;
          }

          &.btn-delete:hover {
            background: #ffebee;
          }
        }
      }
    }

    .no-notifications {
      text-align: center;
      padding: 40px;
      color: #999;
    }
  }

  .loading {
    text-align: center;
    padding: 40px;
    color: #666;
  }
}
```

---

## ⚛️ Integración con React

### Hook Personalizado

```typescript
// useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WsMessage {
  id: string;
  senderEmail?: string;
  receiverEmail?: string | null;
  message?: string;
  isSeen?: boolean;
  timestamp?: any;
  type?: string;
  timeOnlineInSeconds?: number | null;
  url?: string | null;
  notificationType?: string | null;
  utilId?: string | null;
  notificationDescription?: string | null;
}

export const useNotifications = (userEmail: string, firebaseToken: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<WsMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('https://tu-backend.com/api/v1/ws', {
      query: { token: firebaseToken },
      transports: ['websocket'],
      reconnection: true
    });

    newSocket.on('connect', () => {
      console.log('✅ Conectado');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Desconectado');
      setConnected(false);
    });

    newSocket.on('privateMessage', (msg: WsMessage) => {
      console.log('📨 Nueva notificación:', msg);
      setNotifications(prev => [msg, ...prev]);
    });

    newSocket.on('messageToAll', (msg: WsMessage) => {
      console.log('📢 Broadcast:', msg);
      setNotifications(prev => [msg, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [firebaseToken]);

  const loadNotifications = useCallback((limit = 50, includeBroadcast = true) => {
    if (!socket) return Promise.resolve();

    setLoading(true);
    return new Promise((resolve) => {
      socket.emit('listMessagesByUser', {
        receiverEmail: userEmail,
        limit,
        includeBroadcast
      }, (response: any) => {
        setNotifications(response.docs);
        setLoading(false);
        resolve(response);
      });
    });
  }, [socket, userEmail]);

  const deleteNotification = useCallback((messageId: string) => {
    if (!socket) return Promise.resolve({ success: false });

    return new Promise<any>((resolve) => {
      socket.emit('deleteMessage', {
        messageId,
        userEmail
      }, (response: any) => {
        if (response.success) {
          setNotifications(prev => prev.filter(n => n.id !== messageId));
        }
        resolve(response);
      });
    });
  }, [socket, userEmail]);

  const markAsRead = useCallback((messageId: string) => {
    if (!socket) return Promise.resolve({ success: false });

    return new Promise<any>((resolve) => {
      socket.emit('markAsRead', {
        messageId,
        userEmail
      }, (response: any) => {
        if (response.success) {
          setNotifications(prev => 
            prev.map(n => n.id === messageId ? { ...n, isSeen: true } : n)
          );
        }
        resolve(response);
      });
    });
  }, [socket, userEmail]);

  const markAllAsRead = useCallback(() => {
    if (!socket) return Promise.resolve({ success: false });

    const unreadIds = notifications.filter(n => !n.isSeen).map(n => n.id);
    if (unreadIds.length === 0) return Promise.resolve({ success: true });

    return new Promise<any>((resolve) => {
      socket.emit('markMultipleAsRead', {
        messageIds: unreadIds,
        userEmail
      }, (response: any) => {
        if (response.success) {
          setNotifications(prev => prev.map(n => ({ ...n, isSeen: true })));
        }
        resolve(response);
      });
    });
  }, [socket, userEmail, notifications]);

  const unreadCount = notifications.filter(n => !n.isSeen).length;

  return {
    notifications,
    loading,
    connected,
    unreadCount,
    loadNotifications,
    deleteNotification,
    markAsRead,
    markAllAsRead
  };
};
```

### Componente React

```typescript
// NotificationsComponent.tsx
import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface Props {
  userEmail: string;
  firebaseToken: string;
}

export const NotificationsComponent: React.FC<Props> = ({ userEmail, firebaseToken }) => {
  const {
    notifications,
    loading,
    connected,
    unreadCount,
    loadNotifications,
    deleteNotification,
    markAsRead,
    markAllAsRead
  } = useNotifications(userEmail, firebaseToken);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    if (notification.url) {
      window.location.href = notification.url;
    }
  };

  const handleDelete = (e: React.MouseEvent, notification: any) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notificaciones</h2>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        <button onClick={markAllAsRead} disabled={unreadCount === 0}>
          Marcar todas como leídas
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isSeen ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
                <h4>{notification.message}</h4>
                {notification.notificationDescription && (
                  <p>{notification.notificationDescription}</p>
                )}
                <small>{notification.type} • {notification.senderEmail}</small>
              </div>
              
              <div className="notification-actions">
                {!notification.isSeen && (
                  <button onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}>
                    ✓
                  </button>
                )}
                <button onClick={(e) => handleDelete(e, notification)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="no-notifications">
              No tienes notificaciones
            </div>
          )}
        </div>
      )}

      <div className="connection-status">
        {connected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>
    </div>
  );
};
```

---

## 📊 Tipos de Notificaciones Sugeridos

Puedes usar estos valores para `notificationType`:

```typescript
enum NotificationType {
  // Invitaciones
  VEHICLE_INVITATION = 'VEHICLE_INVITATION',
  OPERATOR_INVITATION = 'OPERATOR_INVITATION',
  
  // Sistema
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  SYSTEM_INFO = 'SYSTEM_INFO',
  SYSTEM_WARNING = 'SYSTEM_WARNING',
  
  // Documentos
  DOCUMENT_APPROVED = 'DOCUMENT_APPROVED',
  DOCUMENT_REJECTED = 'DOCUMENT_REJECTED',
  DOCUMENT_EXPIRED = 'DOCUMENT_EXPIRED',
  
  // Mensajes
  MESSAGE = 'MESSAGE',
  PRIVATE_MESSAGE = 'PRIVATE_MESSAGE',
  
  // Otros
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  STATUS_CHANGE = 'STATUS_CHANGE',
}
```

---

## 🎯 Casos de Uso Comunes

### 1. Notificación de Invitación de Vehículo

```typescript
socket.emit('sendMessageToUser', {
  senderEmail: 'empresa@ejemplo.com',
  receiverEmail: 'conductor@ejemplo.com',
  message: 'Nueva invitación de vehículo',
  url: '/vehiculos/invitaciones/12345',
  notificationType: 'VEHICLE_INVITATION',
  utilId: 'VEH-12345',
  notificationDescription: 'Te han asignado un vehículo Ford F-150 2023'
});
```

### 2. Notificación de Documento Rechazado

```typescript
socket.emit('sendMessageToUser', {
  senderEmail: 'auditor@ejemplo.com',
  receiverEmail: 'operador@ejemplo.com',
  message: 'Documento rechazado',
  url: '/documentos/DOC-789',
  notificationType: 'DOCUMENT_REJECTED',
  utilId: 'DOC-789',
  notificationDescription: 'Tu licencia de conducir fue rechazada. Por favor, carga una imagen más clara.'
});
```

### 3. Alerta del Sistema

```typescript
socket.emit('sendMessageToAll', {
  senderEmail: 'system@ejemplo.com',
  message: 'Mantenimiento programado',
  timeOnlineInSeconds: 7200, // 2 horas
  url: '/avisos/mantenimiento',
  notificationType: 'SYSTEM_ALERT',
  utilId: 'MAINT-2025-001',
  notificationDescription: 'El sistema estará fuera de servicio de 2am a 4am'
});
```

---

## ✅ Buenas Prácticas

### 1. **Gestión de Estado**
- Usa Observables (Angular) o State Management (Redux, Zustand)
- Mantén las notificaciones sincronizadas en tiempo real

### 2. **Manejo de Errores**
```typescript
try {
  const result = await notificationService.deleteNotification(id);
  if (!result.success) {
    // Mostrar toast/snackbar con el error
    showErrorToast(result.error);
  }
} catch (error) {
  showErrorToast('Error de conexión');
}
```

### 3. **Reconexión Automática**
```typescript
socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Reconectado después de', attemptNumber, 'intentos');
  // Recargar notificaciones
  loadNotifications();
});
```

### 4. **Indicador Visual**
- Muestra un badge con el contador de no leídas
- Usa colores diferentes para notificaciones no leídas
- Sonidos o vibración para nuevas notificaciones

### 5. **Optimización**
```typescript
// Cargar solo las más recientes inicialmente
loadNotifications(20, true);

// Implementar scroll infinito para cargar más
const loadMore = () => {
  // Cargar notificaciones antiguas bajo demanda
};
```

### 6. **Limpieza**
```typescript
// En Angular: ngOnDestroy
// En React: useEffect cleanup
useEffect(() => {
  return () => {
    socket.disconnect();
  };
}, []);
```

---

## 🔐 Seguridad

### Backend valida automáticamente:
- ✅ Solo puedes eliminar/modificar tus propias notificaciones
- ✅ Los broadcasts pueden ser eliminados por cualquier usuario
- ✅ Requiere autenticación con Firebase Token

### Frontend debe:
- 🔒 Nunca exponer tokens en el código
- 🔒 Usar HTTPS en producción
- 🔒 Validar permisos antes de mostrar opciones de eliminar/editar

---

## 🐛 Troubleshooting

### Problema: No se conecta al WebSocket
**Solución:**
- Verifica que el token de Firebase sea válido
- Revisa la URL del servidor
- Verifica que CORS esté configurado correctamente

### Problema: No recibo notificaciones en tiempo real
**Solución:**
- Verifica que el socket esté conectado (`socket.connected`)
- Revisa que estés escuchando los eventos correctos
- Confirma que el email del usuario coincida

### Problema: Error al eliminar notificación
**Solución:**
- Verifica que el `messageId` sea correcto
- Confirma que el `userEmail` coincida con el receptor
- Revisa los logs del backend

---

## 📚 Referencia Rápida

| Evento | Descripción | Requiere Auth |
|--------|-------------|---------------|
| `sendMessageToAll` | Enviar broadcast | ✅ |
| `sendMessageToUser` | Enviar mensaje privado | ✅ |
| `listMessagesByUser` | Listar notificaciones | ✅ |
| `deleteMessage` | Eliminar notificación | ✅ |
| `markAsRead` | Marcar como leída | ✅ |
| `markMultipleAsRead` | Marcar múltiples como leídas | ✅ |

---

## 🎉 ¡Listo!

Ahora tienes un sistema completo de notificaciones con:
- ✅ Envío de notificaciones privadas y broadcast
- ✅ Listado sin filtros de `isSeen`
- ✅ Eliminación de notificaciones
- ✅ Marcar como leídas (individual y masivo)
- ✅ Campos personalizados (`url`, `notificationType`, `utilId`, `notificationDescription`)
- ✅ Validación de seguridad
- ✅ Manejo robusto de errores

---

## 📞 Soporte

Si tienes dudas o problemas:
1. Revisa los logs del navegador (consola)
2. Revisa los logs del backend
3. Verifica que el token de Firebase sea válido
4. Confirma que el email del usuario coincida

---

**Última actualización:** Noviembre 2025  
**Versión del Backend:** v1.0

