# Cómo subir y obtener imágenes del Resume Vehículo

Este documento explica cómo debe el frontend **subir** y **obtener** las imágenes asociadas al **resume vehículo** (ficha del vehículo):

1. **Fotos del vehículo** — galería de fotos del vehículo (`fotos[]`).
2. **Documentos del vehículo** — archivos (imágenes/PDF) de cada documento cargado (`documentosvehiculo[].documento`).

Todos los archivos se guardan en **`public/uploads/`** en el servidor. El valor guardado en base de datos es siempre el **nombre del archivo** (ej. `1761117297698.jpg`), que se usa después para construir la URL de descarga.

---

## 1. Fotos del vehículo (`fotos`)

El resume vehículo tiene un array **`fotos`** (strings). Cada elemento es el **nombre del archivo** de una foto del vehículo.

### Subir una foto (POST)

**Endpoint:**

```http
POST /api/v1/resumevehiculo/upload/file
Content-Type: multipart/form-data
```

| Campo en el body (form-data) | Tipo   | Descripción                    |
|------------------------------|--------|--------------------------------|
| **foto**                     | file   | Archivo de imagen (JPG, etc.)  |

**Respuesta de ejemplo:**

```json
{
  "message": "upload file successfully",
  "foto": "1761117297698.jpg"
}
```

El valor **`foto`** (ej. `1761117297698.jpg`) es el que debes **agregar al array `fotos`** del resume vehículo al crear o editar (PATCH).

### Obtener la imagen (GET)

**Endpoint:**

```http
GET /api/v1/resumevehiculo/upload/file/{filename}
```

- **`{filename}`**: uno de los valores del array **`fotos`** del resume vehículo (ej. `1761117297698.jpg`).

**Ejemplo de URL en el frontend:**

- Si el resume tiene `fotos: ["1761117297698.jpg", "1761117297699.jpg"]`, la URL para la primera es:
  `https://tu-dominio.com/api/v1/resumevehiculo/upload/file/1761117297698.jpg`

**Uso en HTML:**

```html
<img src="https://tu-dominio.com/api/v1/resumevehiculo/upload/file/1761117297698.jpg" alt="Foto vehículo" />
```

---

## 2. Documentos del vehículo (`documentosvehiculo[].documento`)

Cada elemento de **`documentosvehiculo`** representa un documento (SOAT, revisión, etc.) y tiene un campo **`documento`** con el **nombre del archivo** de la imagen o PDF.

### Opción A: Subir solo el archivo y luego usarlo en PATCH

**Paso 1 — Subir el archivo:**

```http
POST /api/v1/documentoscargadosvehiculo/upload/file
Content-Type: multipart/form-data
```

| Campo en el body (form-data) | Tipo  | Descripción              |
|------------------------------|-------|--------------------------|
| **documento**                | file  | Archivo (imagen o PDF)   |

**Respuesta de ejemplo:**

```json
{
  "message": "upload file successfully",
  "documento": "1761115902287.jpg"
}
```

**Paso 2 — Usar el nombre en el resume vehículo**

- Al crear o editar el resume con **PATCH** `/api/v1/resumevehiculo/:id`, incluye en **`documentosvehiculo`** un objeto con **`documento": "1761115902287.jpg"** (y el resto de campos del documento: `grupodocumento_id`, `documento_id`, fechas, etc.).

### Opción B: Crear el documento con archivo en una sola petición

```http
POST /api/v1/documentoscargadosvehiculo
Content-Type: multipart/form-data
```

Enviar todos los campos del DTO más el archivo en el campo **`documento`**. El servidor asigna automáticamente el nombre del archivo al campo `documento` del registro.

### Actualizar solo la imagen de un documento ya existente

Si el documento ya existe (tiene `_id`) y solo quieres cambiar la imagen:

**Opción 1 — Subir nuevo archivo:**

```http
PATCH /api/v1/documentoscargadosvehiculo/{id}/imagen
Content-Type: multipart/form-data
```

| Campo en el body | Tipo | Descripción        |
|------------------|------|--------------------|
| **documento**    | file | Nueva imagen/archivo |

**Opción 2 — Asignar un archivo ya subido:**

```http
PATCH /api/v1/documentoscargadosvehiculo/{id}/nombre-imagen
Content-Type: application/json
```

```json
{
  "documento": "1761115902287.jpg"
}
```

El valor de **`documento`** debe ser un nombre de archivo ya subido previamente (ej. con `POST .../documentoscargadosvehiculo/upload/file`).

### Obtener la imagen de un documento del vehículo (GET)

El módulo **documentoscargadosvehiculo** no expone un GET para archivos. Las imágenes se sirven desde la **misma carpeta** que las fotos del vehículo, por tanto se usa el endpoint de **resumevehiculo**:

```http
GET /api/v1/resumevehiculo/upload/file/{filename}
```

- **`{filename}`**: valor del campo **`documento`** del documento (ej. `1761115902287.jpg`).

**Ejemplo:** si en la respuesta del resume vehículo un documento tiene `"documento": "1761115902287.jpg"`, la URL para mostrarla es:

`https://tu-dominio.com/api/v1/resumevehiculo/upload/file/1761115902287.jpg`

---

## Resumen de endpoints (Resume Vehículo)

### Subir archivos (POST)

| Uso                          | Endpoint                                      | Campo (multipart) | Respuesta (nombre a guardar)   |
|-----------------------------|-----------------------------------------------|-------------------|--------------------------------|
| Foto del vehículo           | `POST /api/v1/resumevehiculo/upload/file`     | **foto**          | `{ "foto": "1761117297698.jpg" }` → guardar en `fotos[]` |
| Archivo de documento vehículo | `POST /api/v1/documentoscargadosvehiculo/upload/file` | **documento** | `{ "documento": "1761115902287.jpg" }` → usar en `documentosvehiculo[].documento` |

### Obtener imágenes (GET)

| Origen                         | Campo en BD      | URL para obtener la imagen |
|--------------------------------|------------------|----------------------------|
| Foto del vehículo              | elemento de `fotos[]` | `GET /api/v1/resumevehiculo/upload/file/{filename}` |
| Imagen de documento del vehículo | `documentosvehiculo[].documento` | `GET /api/v1/resumevehiculo/upload/file/{filename}` |

En ambos casos **`{filename}`** es exactamente el valor guardado (ej. `1761117297698.jpg`), sin rutas ni prefijos.

### Actualizar imagen de un documento existente (PATCH)

| Acción                         | Endpoint |
|--------------------------------|----------|
| Subir nueva imagen y asignarla al documento | `PATCH /api/v1/documentoscargadosvehiculo/:id/imagen` (body: multipart, campo **documento**) |
| Asignar un archivo ya subido por nombre     | `PATCH /api/v1/documentoscargadosvehiculo/:id/nombre-imagen` (body: `{ "documento": "nombre.jpg" }`) |

---

## Flujo típico en el frontend

### Añadir una nueva foto al vehículo

1. **POST** `/api/v1/resumevehiculo/upload/file` con el archivo en el campo **foto**.
2. Recibir `{ "foto": "1761117297698.jpg" }`.
3. **PATCH** `/api/v1/resumevehiculo/:id` con el body completo del resume, incluyendo en **fotos** el nuevo nombre: `fotos: [ ..., "1761117297698.jpg" ]`.

### Añadir un nuevo documento al vehículo

1. **POST** `/api/v1/documentoscargadosvehiculo/upload/file` con el archivo en el campo **documento**.
2. Recibir `{ "documento": "1761115902287.jpg" }`.
3. **PATCH** `/api/v1/resumevehiculo/:id` con el body completo, añadiendo en **documentosvehiculo** un objeto con **documento**: `"1761115902287.jpg"` y el resto de campos (grupodocumento_id, documento_id, fechas, nombre, etc.).

### Mostrar una foto o imagen de documento

- Construir la URL: **`/api/v1/resumevehiculo/upload/file/`** + valor de `fotos[i]` o de `documentosvehiculo[j].documento`.
- Usar esa URL en `<img src="...">` o en un enlace de descarga.

---

## Errores frecuentes

1. **Usar POST para obtener la imagen**  
   La **obtención** de la imagen es siempre **GET** `/api/v1/resumevehiculo/upload/file/{filename}`. El **POST** es solo para subir.

2. **Campo incorrecto al subir**  
   - Fotos del vehículo: campo **`foto`** en `resumevehiculo/upload/file`.  
   - Documentos del vehículo: campo **`documento`** en `documentoscargadosvehiculo/upload/file`.

3. **Rutas o prefijos en el filename**  
   En la URL GET solo se usa el nombre del archivo (ej. `1761117297698.jpg`), no `uploads/1761117297698.jpg`.

4. **404 al obtener la imagen**  
   Comprobar que el archivo se subió correctamente y que el valor guardado en BD (en `fotos` o en `documentosvehiculo[].documento`) coincide exactamente con el usado en la URL.
