# Payload para agregar documentos de enganche al editar Resume Vehículo

Al editar un vehículo con **PATCH** `/api/v1/resumevehiculo/:id`, el body puede incluir el array **`documentosenganche`**. Cada elemento debe tener la misma estructura que un documento del vehículo, pero usando el campo **`placa_enganche`** (placa del enganche) en lugar de `resumevehicle_id`.

---

## Regla importante: `placa_enganche`

- **`placa_enganche`** debe ser la **placa del enganche** al que pertenece el documento.
- Un resume vehículo puede tener **varios enganches**. En el payload se envía el array **`enganches`** (cada elemento tiene `placa`, `marca_id`, `modelo`, etc.). Los documentos de cada enganche deben usar en `placa_enganche` la **placa** del enganche correspondiente.
- Ejemplo: si envías `"enganches": [{ "placa": "ÑÑÑ123", ... }, { "placa": "ABC456", ... }]`, los documentos del primer enganche llevan `"placa_enganche": "ÑÑÑ123"` y los del segundo `"placa_enganche": "ABC456"`.

---

## Estructura de cada elemento en `documentosenganche`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| **_id** | string | No (solo al editar) | MongoDB ObjectId del documento. **Omitir** al agregar uno nuevo; **incluir** al actualizar uno existente. |
| **placa_enganche** | string | Sí | Placa del enganche (ej. `"ÑÑÑ123"`). Debe coincidir con la `placa` de uno de los objetos en el array `enganches` del mismo payload. |
| grupodocumento_id | string | Sí | ID del grupo de documento (ObjectId). |
| documento_id | string | Sí | ID del tipo de documento (ObjectId). |
| fecha_expedicion | string | Sí | Fecha de expedición (ej. ISO `"2026-02-04T05:00:00.000Z"`). |
| fecha_vencimiento | string | Sí | Fecha de vencimiento (ej. ISO). |
| nombre | string | Sí | Nombre del documento. |
| categoria | string | Sí | ID o valor de categoría (ObjectId como string). |
| codigo_referencia | string | Sí | Código de referencia. |
| observaciones | string | Sí | Observaciones (puede ser `""`). |
| entidad_emisora | string | Sí | ID de la entidad emisora (ObjectId). |
| documento | string | Sí | Nombre del archivo ya subido (ej. `"1771737078128.jpg"`). Subir antes con `POST .../documentoscargadosenganche/upload/file` si aplica. |
| user_id | string | Sí | ID del usuario (ObjectId). Suele ser el mismo que en el payload del resume (`user_id` del body). |
| estado_documento | number | Sí | Estado (ej. `0` o `1`). |

**Nota:** No se usa `resumevehicle_id` en documentos de enganche; la relación es por **`placa_enganche`**.

---

## Ejemplo de payload completo (con documentos de enganche)

A continuación el mismo payload que envías al editar el resume vehículo, con **`enganches`** (array de enganches) y **`documentosenganche`** rellenados. Cada documento en `documentosenganche` usa **`placa_enganche`** igual a la `placa` del enganche al que pertenece.

```json
{
  "placa": "KKJ789",
  "tipovehiculo_id": "634b420dbd2923df36ea1002",
  "marca_id": "644ebd46aca5573ba8044658",
  "modelo_id": "645326e5d7d38c4ffaaf1d56",
  "clasevehiculo_id": "6353a45221b12c48f63f8a68",
  "color_id": "635391be21b12c48f63f8a51",
  "tipocarroceria_id": "6353a22a21b12c48f63f8a5e",
  "ano_id": "64532569d7d38c4ffaaf1d0b",
  "modelo": "4564",
  "modelo_repotenciado": "no",
  "configuracionvehicular": "bonito",
  "numero_motor": "45654654",
  "numero_serie": "6545564654",
  "numero_chasis": "55655",
  "peso_vacio": "5545",
  "capacidad": "5465",
  "propietario_id": "65085c4d1d7a88d66d938be7",
  "tenedor_id": "65085c4d1d7a88d66d938be7",
  "operador_id": "65085c4d1d7a88d66d938be7",
  "tipo_servicio": "especial",
  "empresagps_id": "6401bbca5394e951c47762bf",
  "paginaweb_gps": "www.asf.com",
  "usuario_gps": "asdadsa",
  "clave_gps": "asdasd",
  "ubicacion": "asdasd",
  "ruta_frecuente": "la mas corta",
  "calificacion": "3",
  "fotos": [],
  "documentosvehiculo": [
    {
      "grupodocumento_id": "633dc5a2fafd735feef97aef",
      "documento_id": "63563961b254e1de4342fd5d",
      "fecha_expedicion": "2026-02-04T05:00:00.000Z",
      "fecha_vencimiento": "2026-02-06T05:00:00.000Z",
      "nombre": "ffsd",
      "categoria": "633dc28bfafd735feef97ab6",
      "codigo_referencia": "fsdfd",
      "observaciones": "dfs",
      "entidad_emisora": "6396885d7a73d14b9e9378e5",
      "documento": "1771737078128.jpg",
      "estado_documento": 1,
      "resumevehicle_id": "699a900048b9588d213638fe",
      "user_id": "686987d95e79f868ea1c8695"
    }
  ],
  "documentosenganche": [
    {
      "grupodocumento_id": "633dc5a2fafd735feef97aef",
      "documento_id": "63563961b254e1de4342fd5d",
      "fecha_expedicion": "2026-02-04T05:00:00.000Z",
      "fecha_vencimiento": "2026-02-06T05:00:00.000Z",
      "nombre": "SOAT enganche ÑÑÑ123",
      "categoria": "633dc28bfafd735feef97ab6",
      "codigo_referencia": "ENG-001",
      "observaciones": "",
      "entidad_emisora": "6396885d7a73d14b9e9378e5",
      "documento": "1771737078128.jpg",
      "placa_enganche": "ÑÑÑ123",
      "user_id": "686987d95e79f868ea1c8695",
      "estado_documento": 1
    }
  ],
  "progreso": 0,
  "user_id": "686987d95e79f868ea1c8695",
  "status": true,
  "enganches": [
    {
      "marca_id": "64cd89c857ae6e6b9657a2fd",
      "modelo": "97846+",
      "numero_serie": "4654",
      "color_id": "635391be21b12c48f63f8a51",
      "tipocarroceria_id": "6353a22a21b12c48f63f8a5e",
      "placa": "ÑÑÑ123",
      "peso": 65464,
      "numero_plaqueta": "5645",
      "largo": 54654,
      "ancho": 5465,
      "alto": 465,
      "configuracionvehicular": "s1",
      "capacidad": 5655
    }
  ]
}
```

---

## Solo el array `documentosenganche` (recorte)

Para enviar **solo** la actualización de documentos de enganche (el resto del resume puede ir igual o solo los campos que quieras cambiar), el fragmento relevante es:

```json
"documentosenganche": [
  {
    "grupodocumento_id": "633dc5a2fafd735feef97aef",
    "documento_id": "63563961b254e1de4342fd5d",
    "fecha_expedicion": "2026-02-04T05:00:00.000Z",
    "fecha_vencimiento": "2026-02-06T05:00:00.000Z",
    "nombre": "SOAT enganche ÑÑÑ123",
    "categoria": "633dc28bfafd735feef97ab6",
    "codigo_referencia": "ENG-001",
    "observaciones": "",
    "entidad_emisora": "6396885d7a73d14b9e9378e5",
    "documento": "1771737078128.jpg",
    "placa_enganche": "ÑÑÑ123",
    "user_id": "686987d95e79f868ea1c8695",
    "estado_documento": 1
  }
]
```

- **Agregar nuevo documento:** no incluir `_id` en ese objeto.
- **Editar documento existente:** incluir el `_id` del documento ya guardado, por ejemplo: `"_id": "507f1f77bcf86cd799439011"`.

---

## Resumen de diferencias con `documentosvehiculo`

| Concepto | documentosvehiculo | documentosenganche |
|---------|--------------------|--------------------|
| Relación con el vehículo | `resumevehicle_id` (ID del resume) | `placa_enganche` (placa del enganche) |
| Uso de _id | Opcional: sin _id = crear, con _id = actualizar | Igual: sin _id = crear, con _id = actualizar |

El resto de campos (`grupodocumento_id`, `documento_id`, fechas, `nombre`, `categoria`, `codigo_referencia`, `observaciones`, `entidad_emisora`, `documento`, `user_id`, `estado_documento`) son los mismos en tipo y significado.

---

## Respuesta del resume vehículo (varios enganches)

Al hacer **GET** `/api/v1/resumevehiculo/:id` (o listados), el backend devuelve el resume con **`placas_enganche`**: un array donde cada elemento corresponde a un enganche y contiene sus datos más los documentos de ese enganche:

```json
{
  "_id": "...",
  "placa": "KKJ789",
  "placas_enganche": [
    {
      "placa": "ÑÑÑ123",
      "marca_id": "...",
      "modelo": "97846+",
      "documentosenganche": [ { ... }, { ... } ]
    },
    {
      "placa": "ABC456",
      "documentosenganche": [ { ... } ]
    }
  ]
}
```

Cada elemento de `placas_enganche` tiene `placa`, datos del enganche (marca, modelo, peso, etc.) y **`documentosenganche`** con los documentos asociados a esa placa.
