# Cómo obtener imágenes de enganches y documentos de enganche

Este documento explica cómo debe llamar el frontend a la API para **mostrar** las imágenes asociadas a:

1. **Documentos de enganche** (archivos subidos como comprobantes: `documento`, ej. `1771791819606.jpg`)
2. **Fotos de enganches** (foto del enganche/trailer: campo `foto` en placa enganche)

Todos los archivos subidos (vehicle docs, enganche docs, fotos de enganches) se guardan en el mismo directorio en el servidor: **`public/uploads/`**. El **nombre del archivo** (ej. `1771791819606.jpg`) es el valor que se guarda en base de datos y es lo que se usa en la URL para obtener la imagen.

---

## 1. Imágenes de **documentos de enganche**

Cada documento cargado de enganche tiene un campo **`documento`** que guarda el **nombre del archivo** (ej. `1771791819606.jpg`).

### Cómo obtener la imagen (GET)

**URL correcta:**

```http
GET /api/v1/documentoscargadosenganche/upload/file/{filename}
```

- **`{filename}`**: valor del campo **`documento`** del registro (ej. `1771791819606.jpg`). Solo el nombre del archivo, sin rutas.
- **Ejemplo:**  
  `GET https://tu-dominio.com/api/v1/documentoscargadosenganche/upload/file/1771791819606.jpg`

**Uso en el frontend:**

- Si en la respuesta del resume vehículo (o de documentos enganche) tienes algo como:  
  `documento: "1771791819606.jpg"`
- La URL para mostrarla en un `<img>` es:  
  `https://tu-dominio.com/api/v1/documentoscargadosenganche/upload/file/1771791819606.jpg`

**Nota:** Antes solo existía **POST** en este módulo para subir el archivo; no había **GET** para devolverlo, por eso fallaba. Ahora el endpoint **GET** `/api/v1/documentoscargadosenganche/upload/file/:filename` está disponible y es la forma correcta de pedir la imagen de un documento de enganche.

---

## 2. Imágenes de **enganches** (foto del enganche)

Cada enganche (placa enganche) puede tener un campo **`foto`** con el **nombre del archivo** de la imagen del enganche/trailer.

### Cómo obtener la imagen (GET)

Puedes usar **cualquiera** de estas dos URLs (ambas sirven el mismo archivo desde `public/uploads/`):

**Opción A – Módulo resume vehículo (genérico para todos los uploads):**

```http
GET /api/v1/resumevehiculo/upload/file/{filename}
```

**Opción B – Módulo documentos enganche (misma carpeta):**

```http
GET /api/v1/documentoscargadosenganche/upload/file/{filename}
```

- **`{filename}`**: valor del campo **`foto`** del enganche (ej. `1771791819606.jpg`).
- **Ejemplo:**  
  `GET https://tu-dominio.com/api/v1/resumevehiculo/upload/file/1771791819606.jpg`

---

## Resumen de endpoints para **mostrar** imágenes

| Origen del archivo              | Campo en BD   | Método | URL para obtener la imagen |
|---------------------------------|---------------|--------|-----------------------------|
| Documento de enganche           | `documento`   | GET    | `/api/v1/documentoscargadosenganche/upload/file/{filename}` |
| Foto del enganche (placa)       | `foto`        | GET    | `/api/v1/resumevehiculo/upload/file/{filename}` o `/api/v1/documentoscargadosenganche/upload/file/{filename}` |
| Documento del vehículo          | `documento`   | GET    | `/api/v1/resumevehiculo/upload/file/{filename}` |

En todos los casos **`{filename}`** es el valor almacenado en base de datos (ej. `1771791819606.jpg`), sin prefijos ni rutas.

---

## Subida de archivos (POST)

Para **subir** el archivo antes de guardar el registro:

| Tipo                    | Método | URL                                           | Campo en el body (multipart) |
|-------------------------|--------|-----------------------------------------------|------------------------------|
| Documento de enganche   | POST   | `/api/v1/documentoscargadosenganche/upload/file` | `documento`                  |
| Foto de enganche        | POST   | `/api/v1/placaenganches/upload/file`          | `foto`                       |
| Foto / doc. vehículo    | POST   | `/api/v1/resumevehiculo/upload/file`           | `foto`                       |

La respuesta incluye el **nombre del archivo** generado (ej. `{ "documento": "1771791819606.jpg" }` o `{ "foto": "1771791819606.jpg" }`). Ese valor es el que debes guardar en BD y usar como **`{filename}`** en las URLs GET anteriores.

---

## Errores frecuentes

1. **Usar la ruta de upload para GET**  
   La URL de **subida** es **POST** `/api/v1/documentoscargadosenganche/upload/file` (sin `:filename`). Para **obtener** la imagen se usa **GET** `/api/v1/documentoscargadosenganche/upload/file/1771791819606.jpg` (con el nombre del archivo).

2. **Incluir rutas o prefijos en `filename`**  
   Solo se usa el nombre del archivo tal como está en BD (ej. `1771791819606.jpg`), no rutas como `uploads/1771791819606.jpg`.

3. **404 / “Archivo no encontrado”**  
   - Comprueba que el archivo se subió correctamente (POST) y que guardaste en BD el `filename` devuelto.  
   - Comprueba que el valor en BD coincide exactamente con el que envías en la URL (incluyendo extensión, ej. `.jpg`).
