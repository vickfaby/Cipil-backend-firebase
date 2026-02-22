# Cambios en el backend: soporte de PDF y archivos en uploads

Este documento describe los cambios realizados en el backend para permitir la subida y descarga de **archivos PDF** además de imágenes en los endpoints de upload. Sirve como guía para reimplementar estos cambios en una versión nueva del proyecto.

---

## Objetivo de los cambios

1. **Seguridad Social:** Añadir endpoint de subida y visualización de archivos (imágenes y PDF) en el módulo `seguridadsociales`.
2. **Resume:** Modificar el endpoint existente de upload para que acepte PDF además de imágenes, y que la ruta GET sirva el archivo con el `Content-Type` correcto según la extensión (no fijo `image/jpeg`).
3. **Utilidad común:** Crear un storage de Multer que guarde archivos con extensión original (timestamp + extensión) en lugar de forzar solo imágenes/jpg.

---

## 1. `src/common/utils/media.handle.ts`

### Qué se hace

- Se habilita el uso de `diskStorage` de Multer y se añade un nuevo export `storageFile` que guarda cualquier archivo (imagen o PDF) conservando la extensión original.

### Cambios concretos

**Imports a añadir (al inicio del archivo):**

```ts
import { diskStorage } from 'multer';
import { extname } from 'path';
```

(Si ya existe `import * as SharpMulter from 'sharp-multer'`, mantenerlo; `storage` con SharpMulter se deja sin tocar para otros usos que solo requieran imágenes.)

**Nuevo export al final del archivo:**

```ts
export const storageFile = diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const name = `${Date.now()}${extname(file.originalname)}`;
    cb(null, name);
  },
});
```

- **destination:** mismo directorio que el resto de uploads (`./public/uploads`).
- **filename:** nombre único por timestamp + extensión del archivo original (ej. `1739812345678.pdf`, `1739812345679.jpg`).

---

## 2. `src/modules/seguridadsociales/seguridadsociales.controller.ts`

### Qué se hace

- Añadir **POST** `/upload/file` para subir un archivo (imagen o PDF).
- Añadir **GET** `/upload/file/:filename` para servir el archivo subido (visualización/descarga).

Las rutas deben declararse **antes** de rutas genéricas como `@Get(':id')` para que no se confundan con un `id` llamado `"upload"`.

### Imports a añadir

```ts
// En @nestjs/common
UseInterceptors,
UploadedFile,
UploadedFiles,
Res,
NotFoundException,
BadRequestException,

// Nuevos imports
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { storageFile } from 'src/common/utils/media.handle';
```

### POST `/upload/file`

- Acepta **un** archivo con el campo **`file`** o **`documento`** (solo uno por petición).
- Storage: `storageFile` (multer `diskStorage` con extensión original).
- Respuesta exitosa: `{ message: 'upload file successfully', filename: string }`.
- Si no se envía ningún archivo: `400 Bad Request` con mensaje indicando que debe usarse el campo "file" o "documento".

**Código del endpoint:**

```ts
@Post('/upload/file')
@UseInterceptors(
  FileFieldsInterceptor(
    [
      { name: 'file', maxCount: 1 },
      { name: 'documento', maxCount: 1 },
    ],
    { storage: storageFile },
  ),
)
uploadFile(
  @UploadedFiles()
  files: { file?: Express.Multer.File[]; documento?: Express.Multer.File[] },
) {
  const file = files.file?.[0] ?? files.documento?.[0];
  if (!file) {
    throw new BadRequestException(
      'Debe enviar un archivo con el campo "file" o "documento"',
    );
  }
  return {
    message: 'upload file successfully',
    filename: file.filename,
  };
}
```

### GET `/upload/file/:filename`

- Sirve el archivo desde `public/uploads` usando `res.sendFile`.
- El `Content-Type` lo resuelve Express según la extensión (PDF, jpg, etc.).
- Si el archivo no existe o el nombre no es válido: `404 Not Found`.

**Código del endpoint:**

```ts
@Get('/upload/file/:filename')
viewFile(@Param('filename') filename: string, @Res() res: Response) {
  const filePath = join(process.cwd(), 'public', 'uploads', filename);
  if (!existsSync(filePath)) {
    throw new NotFoundException('Archivo no encontrado');
  }
  return res.sendFile(filePath);
}
```

Colocar ambos métodos (POST y GET) **antes** de `@Get(':id')` y `@Get('/resume/:resume')`.

---

## 3. `src/modules/resume/resume.controller.ts`

### Qué se hace

- **POST** `/upload/file`: dejar de usar el storage que solo procesa imágenes (SharpMulter) y usar `storageFile` para aceptar también PDF (y cualquier extensión).
- **GET** `/upload/file/:filename`: dejar de devolver siempre `Content-Type: image/jpeg` y usar `res.sendFile` para que el tipo se ajuste al archivo (PDF, jpg, etc.).

### Imports

**Añadir:**

```ts
Res,
```
(en los imports de `@nestjs/common`)

```ts
import { Response } from 'express';
import { storageFile } from 'src/common/utils/media.handle';
```

**Quitar o ajustar:**

- De `@nestjs/common`: si ya no se usa `StreamableFile` en este controlador para otra ruta, se puede dejar el import por la ruta `pdf/...` que sí lo usa.
- De `fs`: quitar `createReadStream` y `statSync` si solo se usaban en `getUploadedImage`.
- Cambiar el import de `storage` por `storageFile` en `media.handle`.

### POST `/upload/file`

**Antes (solo imágenes):**

```ts
@UseInterceptors(FileInterceptor('foto', { storage }))
```

**Después (imágenes y PDF):**

```ts
@UseInterceptors(FileInterceptor('foto', { storage: storageFile }))
```

El campo del formulario sigue siendo **`foto`**. La respuesta sigue siendo `{ message: 'upload file successfully', foto: file.filename }`.

### GET `/upload/file/:filename`

**Antes:** Se devolvía un `StreamableFile` con `Content-Type: image/jpeg` fijo.

**Después:** Usar `@Res()` y `res.sendFile(filePath)` para que el tipo se infiera por extensión. Mantener la validación del nombre del archivo (path traversal) y la comprobación de que existe.

**Código del endpoint:**

```ts
@Get('/upload/file/:filename')
getUploadedFile(
  @Param('filename') filename: string,
  @Res() res: Response,
): void {
  const isValidName = /^[A-Za-z0-9_.-]+$/.test(filename);
  if (!isValidName) {
    throw new NotFoundException('Archivo no encontrado');
  }

  const filePath = join(process.cwd(), 'public', 'uploads', filename);
  if (!existsSync(filePath)) {
    throw new NotFoundException('Archivo no encontrado');
  }

  res.sendFile(filePath);
}
```

- Se elimina el decorador `@Header('Content-Type', 'image/jpeg')`.
- `res.sendFile(filePath)` debe recibir la ruta absoluta (por ejemplo `join(process.cwd(), 'public', 'uploads', filename)` como en el código anterior).

---

## Resumen de endpoints afectados

| Módulo              | Método | Ruta                                      | Cambio |
|---------------------|--------|-------------------------------------------|--------|
| seguridadsociales   | POST   | `/api/v1/seguridadsociales/upload/file`   | Nuevo: subir archivo (campo `file` o `documento`). |
| seguridadsociales   | GET    | `/api/v1/seguridadsociales/upload/file/:filename` | Nuevo: servir archivo subido. |
| resume              | POST   | `/api/v1/resume/upload/file`              | Ahora usa `storageFile`: acepta PDF además de imágenes. |
| resume              | GET    | `/api/v1/resume/upload/file/:filename`   | Ahora sirve el archivo con Content-Type según extensión (no fijo image/jpeg). |

---

## Orden recomendado al reimplementar

1. **media.handle.ts:** Añadir imports y `storageFile`.
2. **seguridadsociales.controller.ts:** Añadir imports, POST y GET de upload/file (antes de las rutas `:id` y `/resume/:resume`).
3. **resume.controller.ts:** Cambiar import a `storageFile`, actualizar POST a `storage: storageFile`, sustituir el GET por la versión con `res.sendFile`.

---

## Dependencias

- `multer` (ya usado por Nest/Express para multipart).
- `@nestjs/platform-express` (FileInterceptor, FileFieldsInterceptor).
- No se añaden paquetes nuevos; solo se usa `diskStorage` de multer además del SharpMulter existente.

---

## Nota sobre el frontend

- **Seguridad Social:** La URL para **ver** el archivo es `/api/v1/seguridadsociales/upload/file/:filename` (no `/view/...`).
- **Resume:** Sigue siendo `/api/v1/resume/upload/file/:filename`; ahora sirve correctamente PDF e imágenes según extensión.
