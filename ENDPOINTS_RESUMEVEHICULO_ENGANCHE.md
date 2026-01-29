---

## 5. Catálogos necesarios y endpoints

Para poder construir el payload del resumen de vehículo y del enganche, el frontend debe consumir previamente varios catálogos.  
Todos los endpoints siguientes asumen el **prefijo global**:

```http
/api/v1
```

Es decir, el path final será siempre `/api/v1/<recurso>`.

### 5.1. Catálogos de configuración del vehículo

- **Tipos de vehículo**
  - **Listado completo**: `GET /api/v1/tipovehiculos`
  - **Detalle por ID**: `GET /api/v1/tipovehiculos/:id`

- **Marcas de vehículo**
  - **Listado completo**: `GET /api/v1/marcasvehiculos`
  - **Detalle por ID**: `GET /api/v1/marcasvehiculos/:id`

- **Años por marca de vehículo**
  - **Listado completo**: `GET /api/v1/anosvehiculos`
  - **Detalle por ID**: `GET /api/v1/anosvehiculos/:id`
  - **Años por marca**: `GET /api/v1/anosvehiculos/brand/:brand`

- **Modelos de vehículo**
  - **Listado completo**: `GET /api/v1/modelosvehiculos`
  - **Detalle por ID**: `GET /api/v1/modelosvehiculos/:id`
  - **Modelos por marca y año**:  
    `GET /api/v1/modelosvehiculos/:marca_vehiculo_id/:marca_vehiculo_ano_id`

- **Colores**
  - **Listado completo**: `GET /api/v1/colores`
  - **Detalle por ID**: `GET /api/v1/colores/:id`

- **Tipos de carrocería**
  - **Listado completo**: `GET /api/v1/tipocarrocerias`
  - **Detalle por ID**: `GET /api/v1/tipocarrocerias/:id`

- **Clases de vehículo**
  - **Listado completo**: `GET /api/v1/clasesvehiculos`
  - **Detalle por ID**: `GET /api/v1/clasesvehiculos/:id`

- **Empresas de GPS**
  - **Listado completo**: `GET /api/v1/empresagps`
  - **Detalle por ID**: `GET /api/v1/empresagps/:id`

### 5.2. Catálogos específicos del enganche

- **Marcas de enganche**
  - **Listado completo**: `GET /api/v1/marcaenganches`
  - **Detalle por ID**: `GET /api/v1/marcaenganches/:id`

- **Placas de enganche** (para buscar si ya existe uno)
  - **Listado completo**: `GET /api/v1/placaenganches`
  - **Detalle por ID**: `GET /api/v1/placaenganches/:id`
  - **Búsqueda por placa**: `GET /api/v1/placaenganches/placa/:placa`

> El flujo descrito en este documento permite crear/actualizar el enganche y su placa **directamente** desde `POST /api/v1/resumevehiculo`, pero estos endpoints pueden usarse para validaciones previas (por ejemplo, verificar si ya existe un enganche con cierta placa).

### 5.3. Catálogos para documentos

- **Grupo de documentos**
  - **Listado completo**: `GET /api/v1/grupodocumentos`
  - **Detalle por ID**: `GET /api/v1/grupodocumentos/:id`

- **Documentos**
  - **Listado completo**: `GET /api/v1/documentos`
  - **Detalle por ID**: `GET /api/v1/documentos/:id`
  - **Documentos por grupo**: `GET /api/v1/documentos/grupodocumento/:grupodocumento`

## Guía Frontend: Creación de Resumen de Vehículo con Enganche y Documentos

**Objetivo**: explicar qué endpoint usar y cómo armar el payload para que, al crear un `RESUMEVEHICULO`, el backend también cree/actualice:

- **Enganche** (registro de la unidad remolcada)
- **Placa de enganche** y su relación con la **marca de enganche**
- **Documentos del enganche**

---

## 1. Endpoint a utilizar

**Toda la lógica se dispara con un solo endpoint:**

```http
POST /api/v1/resumevehiculo
Content-Type: application/json
Authorization: Bearer <token>
```

- Es el mismo endpoint que ya se usa para crear la hoja de vida de un vehículo.
- El comportamiento especial de enganche se activa cuando:
  - El `tipovehiculo_id` corresponde a un tipo de vehículo **ARTICULADO**, y
  - Se envía el objeto anidado `enganche` dentro del payload.

El backend se encarga de:

- Crear el registro `RESUMEVEHICULO`.
- Crear o actualizar la **placa de enganche** (`PLACAENGANCHES`) usando `enganche.placa` como valor único.
- Asociar esa placa con su **marca de enganche** (`MARCAENGANCHES`) mediante `enganche.marca_id`.
- Crear los **documentos del enganche** en `DOCUMENTOSCARGADOSENGANCHE` a partir de `documentosenganche[]`.
- Relacionar esos documentos y la placa de enganche con el `RESUMEVEHICULO`.

---

## 2. Flujo para el frontend según tipo de vehículo

### 2.1. Vehículos NO ARTICULADOS

- No se envía el objeto `enganche`.
- Si el vehículo está asociado a un enganche ya existente, se puede enviar `placa_enganche` directamente en el nivel raíz.

**Ejemplo de payload (no articulado):**

```json
{
  "fotos": ["url_foto1.jpg"],
  "placa": "ABC123",
  "tipovehiculo_id": "ID_TIPO_NO_ARTICULADO",
  "marca_id": "ID_MARCA_VEHICULO",
  "ano_id": "ID_ANO",
  "modelo_id": "ID_MODELO",
  "modelo": "Modelo del Vehículo",
  "color_id": "ID_COLOR",
  "tipocarroceria_id": "ID_TIPO_CARROCERIA",
  "clasevehiculo_id": "ID_CLASE_VEHICULO",
  "propietario_id": "ID_PROPIETARIO",
  "tenedor_id": "ID_TENEDOR",
  "operador_id": "ID_OPERADOR",
  "tipo_servicio": "Carga",
  "empresagps_id": "ID_EMPRESA_GPS",
  "ubicacion": "Ciudad",
  "ruta_frecuente": "Ruta principal",
  "placa_enganche": "PLACA_ENGANCHE_EXISTENTE",
  "documentosvehiculo": [
    {
      "grupodocumento_id": "ID_GRUPO_DOC_VEHICULO",
      "documento_id": "ID_DOC_VEHICULO",
      "fecha_expedicion": "2025-01-01",
      "fecha_vencimiento": "2026-01-01",
      "nombre": "SOAT Vehículo",
      "categoria": "Seguros",
      "codigo_referencia": "REF_VEH_123",
      "observaciones": "Observaciones",
      "entidad_emisora": "Entidad",
      "documento": "url_pdf_vehiculo.pdf",
      "user_id": "ID_USUARIO",
      "estado_documento": 1
    }
  ],
  "documentosenganche": [],
  "progreso": 0,
  "user_id": "ID_USUARIO",
  "status": false,
  "disponible": true
}
```

### 2.2. Vehículos ARTICULADOS (con enganche)

Para que el backend **cree/actualice enganche, placa y documentos** en un solo `POST`, el frontend debe:

1. Enviar un `tipovehiculo_id` que corresponda a un tipo **ARTICULADO**.
2. Incluir un objeto anidado `enganche` con los campos requeridos.
3. Incluir el arreglo `documentosenganche[]` con los documentos asociados al enganche.
4. **No enviar** `placa_enganche` en el nivel raíz cuando se envía `enganche`; ese valor se rellena automáticamente desde `enganche.placa`.

> **Nota sobre `configuracionvehicular` del enganche**  
> Este campo **no son 4 campos distintos (`s1`, `s2`, `s3`, `s4`)**, sino **un solo campo** cuyo valor se elige de un catálogo con exactamente estas 4 opciones:  
> - `"config eje s1"`  
> - `"config eje s2"`  
> - `"config eje s3"`  
> - `"config eje s4"`

**Ejemplo de payload completo (articulado):**

```json
{
  "fotos": ["url_foto.jpg"],
  "placa": "ABC123",
  "tipovehiculo_id": "ID_TIPO_ARTICULADO",
  "marca_id": "ID_MARCA_VEHICULO",
  "ano_id": "ID_ANO",
  "modelo_id": "ID_MODELO",
  "modelo": "Modelo Vehículo",
  "modelo_repotenciado": "Modelo repotenciado (opcional)",
  "color_id": "ID_COLOR_VEHICULO",
  "tipocarroceria_id": "ID_TIPO_CARROCERIA_VEHICULO",
  "clasevehiculo_id": "ID_CLASE_VEHICULO",
  "configuracionvehicular": "Configuración vehículo (opcional)",
  "numero_motor": "NUM_MOTOR (opcional)",
  "numero_serie": "NUM_SERIE (opcional)",
  "numero_chasis": "NUM_CHASIS (opcional)",
  "peso_vacio": "1500",
  "capacidad": "5000",
  "propietario_id": "ID_PROPIETARIO",
  "tenedor_id": "ID_TENEDOR",
  "operador_id": "ID_OPERADOR",
  "tipo_servicio": "Carga",
  "empresagps_id": "ID_EMPRESA_GPS",
  "paginaweb_gps": "https://gps.com",
  "usuario_gps": "usuario",
  "clave_gps": "clave",
  "ubicacion": "Ciudad",
  "calificacion": "5",
  "ruta_frecuente": "Ruta principal",

  "enganche": {
    "marca_id": "ID_MARCA_ENGANCHE",
    "modelo": "Modelo Enganche",
    "numero_serie": "SERIE_ENGANCHE_123",
    "color_id": "ID_COLOR_ENGANCHE",
    "tipocarroceria_id": "ID_TIPO_CARROCERIA_ENGANCHE",
    "numero_plaqueta": "PLAQUETA123",
    "placa": "PLACA_ENGANCHE_UNICA",
    "largo": 10.5,
    "ancho": 2.5,
    "alto": 3.0,
    "configuracionvehicular": "config eje s1",
    "peso": 5000,
    "capacidad": 15000,
    "foto": "url_foto_enganche.jpg"
  },

  "documentosvehiculo": [
    {
      "grupodocumento_id": "ID_GRUPO_DOC_VEHICULO",
      "documento_id": "ID_DOC_VEHICULO",
      "fecha_expedicion": "2025-01-01",
      "fecha_vencimiento": "2026-01-01",
      "nombre": "SOAT Vehículo",
      "categoria": "Seguros",
      "codigo_referencia": "REF_VEH_123",
      "observaciones": "Observaciones",
      "entidad_emisora": "Entidad",
      "documento": "url_pdf_vehiculo.pdf",
      "user_id": "ID_USUARIO",
      "estado_documento": 1
    }
  ],

  "documentosenganche": [
    {
      "grupodocumento_id": "ID_GRUPO_DOC_ENGANCHE",
      "documento_id": "ID_DOC_ENGANCHE",
      "fecha_expedicion": "2025-01-01",
      "fecha_vencimiento": "2026-01-01",
      "nombre": "SOAT Enganche",
      "categoria": "Seguros",
      "codigo_referencia": "REF_ENG_123",
      "observaciones": "Observaciones",
      "entidad_emisora": "Entidad",
      "documento": "url_pdf_enganche.pdf",
      "placa_enganche": "",
      "user_id": "ID_USUARIO",
      "estado_documento": 1
    }
  ],

  "progreso": 0,
  "user_id": "ID_USUARIO",
  "status": false,
  "disponible": true
}
```

---

## 3. Detalle por entidad (vista lógica)

Esta sección es solo para entendimiento del frontend; todo se ejecuta automáticamente en el backend luego del `POST /api/v1/resumevehiculo`.

### 3.1. `RESUMEVEHICULO`

- Crea el resumen de vehículo con todos los campos enviados.
- Si el payload incluye `enganche` y el tipo de vehículo es ARTICULADO:
  - Usa `enganche.placa` para rellenar el campo `placa_enganche` del `RESUMEVEHICULO`.
  - Asocia los documentos enviados en `documentosvehiculo` y `documentosenganche`.

### 3.2. `PLACAENGANCHES`

- Se alimenta a partir del objeto `enganche`.
- Usa:
  - `enganche.placa` como **valor único** (UK).
  - `enganche.marca_id` como **FK** a `MARCAENGANCHES`.
- Reglas de negocio:
  - Si ya existe una placa de enganche con esa `placa`, el backend **actualiza** el registro.
  - Si no existe, el backend **crea** un nuevo registro.
- Algunos campos como `propietario_id`, `tenedor_id` y `user_id` se copian automáticamente desde el vehículo principal.

### 3.3. `MARCAENGANCHES`

- El frontend **no crea marcas** dentro de este flujo.
- Solo debe enviar un `marca_id` válido en `enganche.marca_id`, obtenido de un catálogo (select/combo).
- Relación:
  - `PLACAENGANCHES.marca_id` → `MARCAENGANCHES._id`.

### 3.4. `DOCUMENTOSCARGADOSENGANCHE`

- Se alimenta desde el arreglo `documentosenganche[]`.
- Por cada objeto del array el backend crea un documento con los campos:
  - `grupodocumento_id`
  - `documento_id`
  - `fecha_expedicion`
  - `fecha_vencimiento`
  - `nombre`
  - `categoria`
  - `codigo_referencia`
  - `observaciones`
  - `entidad_emisora`
  - `documento`
  - `user_id`
  - `estado_documento`
- El campo `placa_enganche`:
  - Puede enviarse vacío en el payload.
  - Luego de crear/actualizar el enganche, el backend lo completa con `enganche.placa`.

---

## 4. Reglas importantes para el frontend

- **Objeto `enganche` siempre anidado**, sin prefijos:
  - ✅ Correcto:

    ```json
    {
      "enganche": {
        "marca_id": "ID_MARCA",
        "modelo": "Modelo",
        "placa": "PLACA123"
      }
    }
    ```

  - ❌ Incorrecto:

    ```json
    {
      "enganche_marca_id": "ID_MARCA",
      "enganche_modelo": "Modelo",
      "enganche_placa": "PLACA123"
    }
    ```

- **No enviar `placa_enganche` en el nivel raíz** cuando se envía `enganche`; el backend la calcula usando `enganche.placa`.
- **`tipovehiculo_id` debe ser de tipo ARTICULADO** para que se active la lógica de enganche.
- **`documentosenganche` debe ser un array** (vacío o con documentos). Si hay documentos, respetar exactamente la estructura mostrada.
- Todos los IDs (`marca_id`, `color_id`, `tipocarroceria_id`, etc.) deben provenir de catálogos ya cargados en el frontend.

Con este documento, el frontend puede implementar el flujo de creación de resumen de vehículo (articulado o no articulado) con la creación automática de enganche, su placa y sus documentos usando únicamente el endpoint `POST /api/v1/resumevehiculo`.

