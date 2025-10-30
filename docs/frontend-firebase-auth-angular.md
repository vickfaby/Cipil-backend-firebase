## Guía de integración Frontend (Angular) con Firebase Auth y este backend

Esta guía explica cómo autenticar usuarios con Firebase (email/contraseña) en Angular y cómo consumir este backend usando el ID token de Firebase en el header `Authorization: Bearer <ID_TOKEN>`. También cubre la conexión a Socket.IO con el token para recibir notificaciones en tiempo real.

### Resumen de cómo valida este backend

- El backend protege rutas con `FirebaseAuthGuard` y valida el ID token de Firebase recibido en el header `Authorization: Bearer <ID_TOKEN>`.
- Para WebSocket, el backend valida `token` en el handshake: `auth: { token: <ID_TOKEN> }`.
- Endpoint de ejemplo protegido: `GET /api/v1/profile` (dev: `http://localhost:3002/api/v1/profile`, prod: `https://api.cipilapp.com/api/v1/profile`).

Importante: no subas ni incluyas en el frontend ninguna credencial de servicio (service account) de Firebase. En el frontend solo se usa la configuración pública de la app web (apiKey, authDomain, etc.).

---

## 1) Dependencias

```bash
npm i firebase @angular/fire socket.io-client
```

---

## 2) Configuración de entornos (Angular)

Coloca la configuración pública de tu proyecto Firebase en `environment.ts` y `environment.prod.ts`.

`src/environments/environment.ts` (desarrollo):

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3002/api/v1',
  socketUrl: 'http://localhost:3002',
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_STORAGE_BUCKET',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID',
  },
};
```

`src/environments/environment.prod.ts` (producción):

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.cipilapp.com/api/v1',
  socketUrl: 'https://api.cipilapp.com',
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_STORAGE_BUCKET',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID',
  },
};
```

Dónde conseguir estos valores: en la consola de Firebase > Configuración del proyecto > Tus apps > Web > Configuración.

---

## 3) Inicialización de Firebase (AngularFire)

En `app.module.ts` inicializa AngularFire y Auth. Ejemplo mínimo:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Estructura sugerida:
- `src/app/core/services/auth.service.ts`
- `src/app/core/interceptors/auth.interceptor.ts`
- `src/app/core/services/socket.service.ts`

---

## 4) Servicio de autenticación (Firebase email/contraseña)

`src/app/core/services/auth.service.ts`:

```ts
import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onIdTokenChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, from, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  user$ = this.currentUserSubject.asObservable();

  private idTokenSubject = new BehaviorSubject<string | null>(null);
  idToken$ = this.idTokenSubject.asObservable();

  constructor() {
    onIdTokenChanged(this.auth, async (user) => {
      this.currentUserSubject.next(user);
      const token = user ? await user.getIdToken(/* forceRefresh */ false) : null;
      this.idTokenSubject.next(token);
    });
  }

  loginWithEmail(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  async getIdToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    return user ? user.getIdToken() : null;
  }

  logout() {
    this.idTokenSubject.next(null);
    return from(signOut(this.auth));
  }
}
```

Notas:
- Firebase refresca el ID token automáticamente. Con `onIdTokenChanged` te suscribes a cambios y mantienes actualizado el token para HTTP y Socket.

---

## 5) Interceptor HTTP (adjunta Authorization Bearer)

`src/app/core/interceptors/auth.interceptor.ts`:

```ts
import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiCall = req.url.startsWith(environment.apiBaseUrl);
    if (!isApiCall) {
      return next.handle(req);
    }

    return from(this.authService.getIdToken()).pipe(
      switchMap((token) => {
        if (!token) {
          return next.handle(req);
        }
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next.handle(authReq);
      })
    );
  }
}
```

Prueba rápida (ruta protegida en este backend):

```ts
// En cualquier servicio Angular que consuma la API
this.http.get(`${environment.apiBaseUrl}/profile`).subscribe(console.log);
```

Debe responder con `{ message: 'Acceso permitido ✅', user: ... }` cuando el usuario esté autenticado en Firebase.

---

## 6) Socket.IO con token de Firebase (notificaciones)

El gateway del backend espera el token en el handshake: `auth: { token }`. Implementación sugerida:

`src/app/core/services/socket.service.ts`:

```ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private auth = inject(AuthService);
  private sub: Subscription;

  constructor() {
    // Conéctate inicialmente y re-conéctate cuando cambie el ID token
    this.sub = this.auth.idToken$.subscribe((token) => {
      this.connect(token);
    });
  }

  private connect(token: string | null) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (!token) return;

    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Socket conectado');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión Socket:', err.message);
    });

    // Ejemplo de evento que emite el backend
    this.socket.on('newMessage', (payload) => {
      console.log('Nuevo mensaje:', payload);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.socket?.disconnect();
  }
}
```

Con esto, cuando el usuario inicia sesión y obtiene un ID token válido, el socket se conecta y escucha eventos como `newMessage` enviados por el backend.

---

## 7) Flujo completo sugerido (email/contraseña)

1. Usuario envía email y contraseña desde Angular.
2. `AuthService.loginWithEmail(email, password)` (Firebase) autentica y genera un ID token.
3. El `AuthInterceptor` agrega `Authorization: Bearer <ID_TOKEN>` a las llamadas hacia `environment.apiBaseUrl`.
4. Rutas protegidas en este backend validan el token (no necesitas un JWT adicional).
5. `SocketService` establece el handshake con `auth: { token: <ID_TOKEN> }` y recibe notificaciones.
6. En logout, llama a `AuthService.logout()` y el socket se desconecta.

Opcional: si necesitas obtener datos del usuario de tu base (documento y perfil interno), puedes exponer/consumir un endpoint que devuelva el perfil usando el email del usuario autenticado. El backend actual incluye `GET /api/v1/profile` que ya devuelve el objeto `user` decodificado desde Firebase.

---

## 8) Manejo de actualización del token

- Firebase refresca el ID token de forma automática; `onIdTokenChanged` actualiza el `BehaviorSubject`.
- HTTP: el interceptor consultará `getIdToken()` antes de cada request.
- Socket: al cambiar el token, el servicio anterior reconecta con el nuevo token.

---

## 9) Seguridad y buenas prácticas

- Nunca incluyas credenciales de servicio (claves privadas) en el frontend ni en el repo.
- La configuración pública de Firebase (apiKey, etc.) es segura para el cliente.
- Evita guardar el ID token en `localStorage`. Prefiere mantenerlo en memoria y obtenerlo vía Firebase (`currentUser.getIdToken()`).
- Restringe CORS y orígenes permitidos en producción.

---

## 10) Verificación rápida con cURL

```bash
# Reemplaza <ID_TOKEN> por el ID token vigente del usuario autenticado
curl -H "Authorization: Bearer <ID_TOKEN>" http://localhost:3002/api/v1/profile
```

Debes recibir `200 OK` con el usuario decodificado.

---

## 11) Dónde colocar tu firebaseConfig

- Colócalo en `src/environments/environment.ts` y `environment.prod.ts` como se muestra arriba.
- No uses el archivo de credenciales de servicio (JSON con `private_key`) en el frontend; eso solo se usa en el backend mediante variables de entorno.

---

## 12) Ejemplos de componentes y guardas (Angular)

### 12.1) Componente de Login (Reactive Forms)

`src/app/features/auth/login.component.ts`:

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  error: string | null = null;

  async submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = null;
    const { email, password } = this.form.value as { email: string; password: string };
    try {
      await this.auth.loginWithEmail(email, password).toPromise();
      this.router.navigateByUrl('/profile');
    } catch (e: any) {
      this.error = e?.message ?? 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
```

`src/app/features/auth/login.component.html`:

```html
<form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
  <label>
    Contraseña
    <input type="password" formControlName="password" />
  </label>
  <button type="submit" [disabled]="loading || form.invalid">Entrar</button>
  <p *ngIf="error" class="error">{{ error }}</p>
  <p *ngIf="loading">Procesando...</p>
  <p *ngIf="form.invalid && form.touched">Revisa los campos</p>
  <style>
    .login-form { display: grid; gap: 12px; max-width: 320px; }
    .error { color: #c00; }
  </style>
  
</form>
```

Ruta ejemplo en tu `app-routing.module.ts`:

```ts
{ path: 'login', component: LoginComponent }
```

### 12.2) Guard de ruta (requiere usuario autenticado)

`src/app/core/guards/auth.guard.ts`:

```ts
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.user$.pipe(
      map((user) => user ? true : this.router.parseUrl('/login'))
    );
  }
}
```

Usa el guard en rutas protegidas:

```ts
{ path: 'profile', canActivate: [AuthGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) }
```

### 12.3) Componente de Profile (consumir `/profile` y logout)

`src/app/features/profile/profile.component.ts` (standalone para simplicidad):

```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Perfil</h2>
      <pre>{{ profile | json }}</pre>
      <button (click)="logout()">Cerrar sesión</button>
    </div>
  `,
})
export class ProfileComponent {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  profile: any = null;

  constructor() {
    this.http.get(`${environment.apiBaseUrl}/profile`).subscribe((res) => {
      this.profile = res;
    });
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
```

### 12.4) Uso del SocketService en un componente

`src/app/features/notifications/notifications.component.ts` (standalone):

```ts
import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h3>Notificaciones</h3>
      <p>Ver la consola para eventos 'newMessage'.</p>
    </div>
  `,
})
export class NotificationsComponent implements OnDestroy {
  private socket = inject(SocketService);
  ngOnDestroy() {}
}
```

Opcionalmente, puedes exponer un `Subject` dentro del `SocketService` para reenviar los mensajes a tus componentes con `next(...)` al recibir `newMessage`.


