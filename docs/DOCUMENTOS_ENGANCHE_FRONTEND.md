# Documentos Cargados Enganche — Guía de implementación frontend

Esta guía describe cómo consumir los endpoints de **documentos cargados de enganche** desde el frontend. Los documentos se asocian a un **enganche** (remolque/semirremolque) mediante la **placa del enganche** (`placa_enganche`).

**Base URL:** `{API_BASE_URL}/api/v1/documentoscargadosenganche`

---

## Índice

1. [Relación documento ↔ vehículo (enganche)](#1-relación-documento--vehículo-enganche)
2. [Crear documento con archivo (upload completo)](#2-crear-documento-con-archivo-upload-completo)
3. [Subir solo archivo (upload/file)](#3-subir-solo-archivo-uploadfile)
4. [Listar y consultar documentos](#4-listar-y-consultar-documentos)
5. [Actualizar documento](#5-actualizar-documento)
6. [Eliminar documento](#6-eliminar-documento)
7. [Ejemplos por tecnología](#7-ejemplos-por-tecnología)
8. [Errores y validaciones](#8-errores-y-validaciones)

---

## 1. Relación documento ↔ vehículo (enganche)

- **Campo de relación:** `placa_enganche`
- **Tipo:** `string`
- **Significado:** Placa (número de placa) del enganche al que pertenece el documento.

Al crear o actualizar un documento, siempre debes enviar la placa del enganche en `placa_enganche` para asociarlo al vehículo correcto.

**Varios enganches por vehículo:** Un resume vehículo puede tener **múltiples enganches**. Al crear o editar el resume (`POST`/`PATCH` `/api/v1/resumevehiculo`), se envía el array **`enganches`** (cada elemento con `placa`, `marca_id`, `modelo`, etc.). La respuesta del resume incluye **`placas_enganche`**: array de objetos (uno por enganche) con datos del enganche y su **`documentosenganche`** anidado. El array **`documentosenganche`** en el payload del PATCH sigue siendo plano; cada documento se asocia a un enganche mediante su campo **`placa_enganche`**.

---

## 2. Crear documento con archivo (upload completo)

Crea un registro de documento y sube el archivo en una sola petición.

| Método | URL | Content-Type |
|--------|-----|--------------|
| `POST` | `/api/v1/documentoscargadosenganche` | `multipart/form-data` |

### Campos del body (form-data)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| **documento** | **File** | Sí | Archivo (PDF, imagen, etc.). Nombre del campo en el form: `documento`. |
| **placa_enganche** | string | Sí | Placa del enganche. **Vincula el documento al enganche.** |
| grupodocumento_id | string | Sí | ID del grupo de documento (MongoDB ObjectId). |
| documento_id | string | Sí | ID del tipo de documento (MongoDB ObjectId). |
| fecha_expedicion | string | Sí | Fecha de expedición. |
| fecha_vencimiento | string | Sí | Fecha de vencimiento. |
| nombre | string | Sí | Nombre del documento. |
| categoria | string | Sí | Categoría. |
| codigo_referencia | string | Sí | Código de referencia. |
| observaciones | string | Sí | Observaciones. |
| entidad_emisora | string | Sí | ID de la entidad emisora (MongoDB ObjectId). |
| user_id | string | Sí | ID del usuario (MongoDB ObjectId). |
| estado_documento | number | Sí | Estado del documento (ej. 0, 1). |

### Respuesta exitosa (201)

El backend devuelve el documento creado (objeto con `_id`, campos guardados y el `documento` como nombre de archivo generado).

### Implementación frontend (concepto)

- Construir un `FormData`.
- Añadir el archivo con la clave `documento`.
- Añadir el resto de campos como entradas de texto (incluyendo `placa_enganche`).
- Enviar con `Content-Type: multipart/form-data` (normalmente el cliente lo fija al usar `FormData`).
- **No** enviar header `Content-Type` manual con boundary; el navegador/fetch lo genera.

---

## 3. Subir solo archivo (upload/file)

Solo almacena el archivo en el servidor y devuelve el nombre generado. **No crea** ningún registro de documento ni usa `placa_enganche`. Útil si quieres subir primero el archivo y luego crear el documento en otro paso.

| Método | URL | Content-Type |
|--------|-----|--------------|
| `POST` | `/api/v1/documentoscargadosenganche/upload/file` | `multipart/form-data` |

### Campos del body (form-data)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| **documento** | **File** | Sí | Archivo a subir. Nombre del campo: `documento`. |

### Respuesta exitosa (201)

```json
{
  "message": "upload file successfully",
  "documento": "nombre-generado-del-archivo.ext"
}
```

Luego puedes crear el documento con `POST /api/v1/documentoscargadosenganche` usando en el body (form-data) el valor de `documento` devuelto aquí más `placa_enganche` y el resto de campos. En ese caso **no** vuelvas a enviar el archivo; solo el string `documento` con el filename.

---

## 4. Listar y consultar documentos

### 4.1 Listar todos

| Método | URL |
|--------|-----|
| `GET` | `/api/v1/documentoscargadosenganche` |

Devuelve un array con todos los documentos (sin filtro por enganche).

---

### 4.2 Por placa del enganche

| Método | URL |
|--------|-----|
| `GET` | `/api/v1/documentoscargadosenganche/placa/:placa` |

**Parámetro de ruta:** `placa` — placa del enganche (ej. `ABC123`).

**Uso:** Para mostrar los documentos de un enganche cuando ya conoces su placa.

**Respuesta:** Array de documentos con `documento_id` y `entidad_emisora` poblados (nombre_documento, nombre_entidad, etc.).

---

### 4.3 Por vehículo (resume)

| Método | URL |
|--------|-----|
| `GET` | `/api/v1/documentoscargadosenganche/vehicle/:vehiculo` |

**Parámetro de ruta:** `vehiculo` — ID del vehículo resume (MongoDB ObjectId). El backend usa este valor para filtrar documentos asociados a ese vehículo/enganche.

**Respuesta:** Array de documentos (con poblados de grupo, documento y entidad emisora; sin `_id`, `user_id`, `deleted`, timestamps en el select del servicio).

---

### 4.4 Por usuario y fecha

| Método | URL |
|--------|-----|
| `GET` | `/api/v1/documentoscargadosenganche/user/:user_id/:date` |

**Parámetros de ruta:**  
- `user_id`: ID del usuario.  
- `date`: Fecha de consulta.

**Uso:** Listar documentos de enganche de un usuario para una fecha dada.

---

### 4.5 Un documento por ID

| Método | URL |
|--------|-----|
| `GET` | `/api/v1/documentoscargadosenganche/:id` |

**Parámetro de ruta:** `id` — MongoDB ObjectId del documento.

**Respuesta:** Objeto del documento o 404 si no existe.

---

## 5. Actualizar documento

| Método | URL | Content-Type |
|--------|-----|--------------|
| `PATCH` | `/api/v1/documentoscargadosenganche/:id` | `application/json` |

**Parámetro de ruta:** `id` — MongoDB ObjectId del documento.

**Body (JSON):** Cualquier subconjunto de los campos del create (todos opcionales en PATCH), por ejemplo:

- `placa_enganche`, `grupodocumento_id`, `documento_id`, `fecha_expedicion`, `fecha_vencimiento`, `nombre`, `categoria`, `codigo_referencia`, `observaciones`, `entidad_emisora`, `documento` (string filename), `user_id`, `estado_documento`.

Para cambiar el archivo asociado sin usar upload/file: subir el archivo con `POST .../upload/file`, obtener `documento` y enviarlo en el PATCH.

**Respuesta:** Documento actualizado.

---

## 6. Eliminar documento

| Método | URL |
|--------|-----|
| `DELETE` | `/api/v1/documentoscargadosenganche/:id` |

**Parámetro de ruta:** `id` — MongoDB ObjectId del documento.

**Respuesta:** Respuesta estándar de eliminación del backend (ej. 200).

---

## 7. Ejemplos por tecnología

### 7.1 Fetch (JavaScript / navegador)

**Crear documento con archivo:**

```javascript
const formData = new FormData();
formData.append('documento', fileInput.files[0]); // File object
formData.append('placa_enganche', 'ABC123');
formData.append('grupodocumento_id', '...');
formData.append('documento_id', '...');
formData.append('fecha_expedicion', '2024-01-15');
formData.append('fecha_vencimiento', '2025-01-15');
formData.append('nombre', 'SOAT enganche');
formData.append('categoria', 'Seguro');
formData.append('codigo_referencia', 'REF-001');
formData.append('observaciones', 'Ninguna');
formData.append('entidad_emisora', '...');
formData.append('user_id', '...');
formData.append('estado_documento', '0');

const response = await fetch(`${API_BASE_URL}/api/v1/documentoscargadosenganche`, {
  method: 'POST',
  body: formData,
  headers: {
    // No incluir Content-Type; el navegador pone multipart/form-data + boundary
    'Authorization': `Bearer ${token}`,
  },
});
const created = await response.json();
```

**Solo subir archivo:**

```javascript
const formData = new FormData();
formData.append('documento', fileInput.files[0]);

const response = await fetch(`${API_BASE_URL}/api/v1/documentoscargadosenganche/upload/file`, {
  method: 'POST',
  body: formData,
  headers: { 'Authorization': `Bearer ${token}` },
});
const { documento: filename } = await response.json();
// Usar `filename` en POST /api/v1/documentoscargadosenganche como campo "documento" + placa_enganche y demás campos
```

**Listar por placa del enganche:**

```javascript
const placa = 'ABC123';
const response = await fetch(
  `${API_BASE_URL}/api/v1/documentoscargadosenganche/placa/${encodeURIComponent(placa)}`,
  { headers: { 'Authorization': `Bearer ${token}` } }
);
const documentos = await response.json();
```

---

### 7.2 Axios (JavaScript / TypeScript)

**Crear documento con archivo:**

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('documento', file);
formData.append('placa_enganche', 'ABC123');
formData.append('grupodocumento_id', grupodocumentoId);
formData.append('documento_id', documentoId);
formData.append('fecha_expedicion', '2024-01-15');
formData.append('fecha_vencimiento', '2025-01-15');
formData.append('nombre', 'SOAT enganche');
formData.append('categoria', 'Seguro');
formData.append('codigo_referencia', 'REF-001');
formData.append('observaciones', '');
formData.append('entidad_emisora', entidadEmisoraId);
formData.append('user_id', userId);
formData.append('estado_documento', 0);

const { data } = await axios.post(
  `${API_BASE_URL}/api/v1/documentoscargadosenganche`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  }
);
```

**PATCH (actualizar):**

```javascript
await axios.patch(
  `${API_BASE_URL}/api/v1/documentoscargadosenganche/${documentId}`,
  { placa_enganche: 'XYZ789', fecha_vencimiento: '2026-01-15' },
  { headers: { 'Authorization': `Bearer ${token}` } }
);
```

---

### 7.3 React (ejemplo con estado y formulario)

```jsx
const [placaEnganche, setPlacaEnganche] = useState('');
const [file, setFile] = useState(null);
// ... más estado para el resto de campos

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('documento', file);
  formData.append('placa_enganche', placaEnganche);
  formData.append('grupodocumento_id', grupodocumentoId);
  formData.append('documento_id', documentoId);
  formData.append('fecha_expedicion', fechaExpedicion);
  formData.append('fecha_vencimiento', fechaVencimiento);
  formData.append('nombre', nombre);
  formData.append('categoria', categoria);
  formData.append('codigo_referencia', codigoReferencia);
  formData.append('observaciones', observaciones);
  formData.append('entidad_emisora', entidadEmisoraId);
  formData.append('user_id', userId);
  formData.append('estado_documento', estadoDocumento);

  const res = await fetch(`${API_BASE_URL}/api/v1/documentoscargadosenganche`, {
    method: 'POST',
    body: formData,
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const created = await res.json();
  // Redirigir o actualizar lista
};
```

---

## 8. Errores y validaciones

- **400 Bad Request:** Falta archivo, falta algún campo requerido o tipos inválidos (por ejemplo `estado_documento` no numérico). Revisar que el form incluya el file en `documento` y todos los campos obligatorios, incluido `placa_enganche`.
- **404 Not Found:** Documento o recurso no encontrado (por ejemplo `GET` o `PATCH` o `DELETE` con `id` inexistente).
- **401/403:** No autorizado o sin permisos; incluir token en `Authorization` si la API lo exige.

Los archivos se guardan en el servidor (por ejemplo en `public/uploads`). Para mostrarlos en el frontend, usa la URL que exponga el backend para archivos estáticos (ej. `{API_BASE_URL}/uploads/{documento}` si está configurado así).

---

## Resumen rápido

| Acción | Método | URL | Campo para enganche |
|--------|--------|-----|----------------------|
| Crear documento + archivo | POST | `/api/v1/documentoscargadosenganche` | `placa_enganche` (form-data) |
| Solo subir archivo | POST | `/api/v1/documentoscargadosenganche/upload/file` | — |
| Listar por placa enganche | GET | `/api/v1/documentoscargadosenganche/placa/:placa` | `placa` en la ruta |
| Listar por vehículo | GET | `/api/v1/documentoscargadosenganche/vehicle/:vehiculo` | `vehiculo` (ObjectId) en la ruta |
| Obtener uno | GET | `/api/v1/documentoscargadosenganche/:id` | — |
| Actualizar | PATCH | `/api/v1/documentoscargadosenganche/:id` | Opcional: `placa_enganche` en body JSON |
| Eliminar | DELETE | `/api/v1/documentoscargadosenganche/:id` | — |

El campo que **relaciona siempre el documento con el enganche** es **`placa_enganche`** (placa del enganche). Debe enviarse al crear y puede actualizarse con PATCH si se cambia de enganche.
