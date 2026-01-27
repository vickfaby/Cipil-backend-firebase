# Payload para Crear Hoja de Vida de Vehículo

## Endpoint
```
POST /api/v1/resumevehiculo
```

## Payload Completo

### Para Vehículos NO ARTICULADOS

```json
{
  "fotos": ["url_foto1.jpg", "url_foto2.jpg"],
  "placa": "ABC123",
  "tipovehiculo_id": "507f1f77bcf86cd799439011",
  "marca_id": "507f1f77bcf86cd799439012",
  "ano_id": "507f1f77bcf86cd799439013",
  "modelo_id": "507f1f77bcf86cd799439014",
  "modelo": "Modelo del Vehículo",
  "modelo_repotenciado": "Modelo Repotenciado (opcional)",
  "color_id": "507f1f77bcf86cd799439015",
  "tipocarroceria_id": "507f1f77bcf86cd799439016",
  "clasevehiculo_id": "507f1f77bcf86cd799439017",
  "configuracionvehicular": "Configuración (opcional)",
  "numero_motor": "123456789 (opcional)",
  "numero_serie": "SERIE123 (opcional)",
  "numero_chasis": "CHASIS123 (opcional)",
  "peso_vacio": "1500 (opcional)",
  "capacidad": "5000 (opcional)",
  "propietario_id": "507f1f77bcf86cd799439018",
  "tenedor_id": "507f1f77bcf86cd799439019",
  "operador_id": "507f1f77bcf86cd799439020",
  "tipo_servicio": "Carga",
  "empresagps_id": "507f1f77bcf86cd799439021",
  "paginaweb_gps": "https://gps.empresa.com",
  "usuario_gps": "usuario_gps",
  "clave_gps": "clave_gps",
  "ubicacion": "Ciudad, País",
  "calificacion": "5",
  "ruta_frecuente": "Ruta Principal",
  "placa_enganche": "PLACA123 (opcional, solo si ya existe un enganche)",
  "documentosvehiculo": [
    {
      "grupodocumento_id": "507f1f77bcf86cd799439022",
      "documento_id": "507f1f77bcf86cd799439023",
      "fecha_expedicion": "2025-01-01",
      "fecha_vencimiento": "2026-01-01",
      "nombre": "Documento del Vehículo",
      "categoria": "Categoría",
      "codigo_referencia": "REF123",
      "observaciones": "Observaciones",
      "entidad_emisora": "Entidad Emisora",
      "documento": "url_documento.pdf",
      "resumevehicle_id": "",
      "user_id": "507f1f77bcf86cd799439024",
      "estado_documento": 1
    }
  ],
  "documentosenganche": [],
  "progreso": 0,
  "user_id": "507f1f77bcf86cd799439024",
  "status": false,
  "disponible": true,
  "tipo_doc_propietario_id": "507f1f77bcf86cd799439025 (opcional)",
  "num_documento_propietario": "1234567890 (opcional)",
  "email_propietario": "propietario@email.com (opcional)",
  "tipo_doc_tenedor_id": "507f1f77bcf86cd799439026 (opcional)",
  "num_documento_tenedor": "0987654321 (opcional)",
  "email_tenedor": "tenedor@email.com (opcional)",
  "tipo_doc_operador_id": "507f1f77bcf86cd799439027 (opcional)",
  "num_documento_operador": "1122334455 (opcional)",
  "email_operador": "operador@email.com (opcional)",
  "tenedor_liga_id": "507f1f77bcf86cd799439028 (opcional)",
  "propietario_liga_id": "507f1f77bcf86cd799439029 (opcional)",
  "operador_liga_id": "507f1f77bcf86cd799439030 (opcional)"
}
```

### Para Vehículos ARTICULADOS (con enganche)

Cuando el `tipovehiculo_id` corresponde a un vehículo de tipo **"ARTICULADO"**, se debe incluir el objeto `enganche` con los siguientes campos:

```json
{
  "fotos": ["url_foto1.jpg", "url_foto2.jpg"],
  "placa": "ABC123",
  "tipovehiculo_id": "507f1f77bcf86cd799439011",
  "marca_id": "507f1f77bcf86cd799439012",
  "ano_id": "507f1f77bcf86cd799439013",
  "modelo_id": "507f1f77bcf86cd799439014",
  "modelo": "Modelo del Vehículo",
  "modelo_repotenciado": "Modelo Repotenciado (opcional)",
  "color_id": "507f1f77bcf86cd799439015",
  "tipocarroceria_id": "507f1f77bcf86cd799439016",
  "clasevehiculo_id": "507f1f77bcf86cd799439017",
  "configuracionvehicular": "Configuración (opcional)",
  "numero_motor": "123456789 (opcional)",
  "numero_serie": "SERIE123 (opcional)",
  "numero_chasis": "CHASIS123 (opcional)",
  "peso_vacio": "1500 (opcional)",
  "capacidad": "5000 (opcional)",
  "propietario_id": "507f1f77bcf86cd799439018",
  "tenedor_id": "507f1f77bcf86cd799439019",
  "operador_id": "507f1f77bcf86cd799439020",
  "tipo_servicio": "Carga",
  "empresagps_id": "507f1f77bcf86cd799439021",
  "paginaweb_gps": "https://gps.empresa.com",
  "usuario_gps": "usuario_gps",
  "clave_gps": "clave_gps",
  "ubicacion": "Ciudad, País",
  "calificacion": "5",
  "ruta_frecuente": "Ruta Principal",
  "enganche": {
    "marca_id": "507f1f77bcf86cd799439031",
    "modelo": "Modelo del Enganche",
    "numero_serie": "SERIE_ENGANCHE123",
    "color_id": "507f1f77bcf86cd799439032",
    "tipocarroceria_id": "507f1f77bcf86cd799439033",
    "numero_plaqueta": "PLAQUETA123 (opcional)",
    "placa": "PLACA_ENGANCHE",
    "largo": 10.5,
    "ancho": 2.5,
    "alto": 3.0,
    "s1": "Configuración de ejes - Eje s1 (opcional)",
    "s2": "Configuración de ejes - Eje s2 (opcional)",
    "s3": "Configuración de ejes - Eje s3 (opcional)",
    "s4": "Configuración de ejes - Eje s4 (opcional)",
    "configuracionvehicular": "Configuración del enganche (opcional)",
    "peso": 5000,
    "capacidad": 15000,
    "foto": "url_foto_enganche.jpg (opcional)"
  },
  "documentosvehiculo": [
    {
      "grupodocumento_id": "507f1f77bcf86cd799439022",
      "documento_id": "507f1f77bcf86cd799439023",
      "fecha_expedicion": "2025-01-01",
      "fecha_vencimiento": "2026-01-01",
      "nombre": "Documento del Vehículo",
      "categoria": "Categoría",
      "codigo_referencia": "REF123",
      "observaciones": "Observaciones",
      "entidad_emisora": "Entidad Emisora",
      "documento": "url_documento.pdf",
      "resumevehicle_id": "",
      "user_id": "507f1f77bcf86cd799439024",
      "estado_documento": 1
    }
  ],
  "documentosenganche": [
    {
      "grupodocumento_id": "507f1f77bcf86cd799439022",
      "documento_id": "507f1f77bcf86cd799439023",
      "fecha_expedicion": "2025-01-01",
      "fecha_vencimiento": "2026-01-01",
      "nombre": "Documento del Enganche",
      "categoria": "Categoría",
      "codigo_referencia": "REF123",
      "observaciones": "Observaciones",
      "entidad_emisora": "Entidad Emisora",
      "documento": "url_documento.pdf",
      "placa_enganche": "",
      "user_id": "507f1f77bcf86cd799439024",
      "estado_documento": 1
    }
  ],
  "progreso": 0,
  "user_id": "507f1f77bcf86cd799439024",
  "status": false,
  "disponible": true,
  "tipo_doc_propietario_id": "507f1f77bcf86cd799439025 (opcional)",
  "num_documento_propietario": "1234567890 (opcional)",
  "email_propietario": "propietario@email.com (opcional)",
  "tipo_doc_tenedor_id": "507f1f77bcf86cd799439026 (opcional)",
  "num_documento_tenedor": "0987654321 (opcional)",
  "email_tenedor": "tenedor@email.com (opcional)",
  "tipo_doc_operador_id": "507f1f77bcf86cd799439027 (opcional)",
  "num_documento_operador": "1122334455 (opcional)",
  "email_operador": "operador@email.com (opcional)",
  "tenedor_liga_id": "507f1f77bcf86cd799439028 (opcional)",
  "propietario_liga_id": "507f1f77bcf86cd799439029 (opcional)",
  "operador_liga_id": "507f1f77bcf86cd799439030 (opcional)"
}
```

## Campos del Objeto `enganche` (Solo para vehículos ARTICULADOS)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `marca_id` | string | ✅ Sí | ID de la marca del enganche (Marcaenganches) |
| `modelo` | string | ✅ Sí | Modelo del enganche |
| `numero_serie` | string | ✅ Sí | Número de serie del enganche |
| `color_id` | string | ✅ Sí | ID del color del enganche (Colores) |
| `tipocarroceria_id` | string | ✅ Sí | ID del tipo de carrocería (Tipocarrocerias) - Cama baja, Botellero, Cama alta |
| `placa` | string | ✅ Sí | Placa del enganche (debe ser única) |
| `peso` | number | ✅ Sí | Peso del enganche en kg |
| `numero_plaqueta` | string | ⚠️ Opcional | Número de plaqueta del enganche |
| `largo` | number | ⚠️ Opcional | Largo del enganche en metros |
| `ancho` | number | ⚠️ Opcional | Ancho del enganche en metros |
| `alto` | number | ⚠️ Opcional | Alto del enganche en metros |
| `s1` | string | ⚠️ Opcional | Configuración de ejes - Eje s1 |
| `s2` | string | ⚠️ Opcional | Configuración de ejes - Eje s2 |
| `s3` | string | ⚠️ Opcional | Configuración de ejes - Eje s3 |
| `s4` | string | ⚠️ Opcional | Configuración de ejes - Eje s4 |
| `configuracionvehicular` | string | ⚠️ Opcional | Configuración vehicular del enganche |
| `capacidad` | number | ⚠️ Opcional | Capacidad del enganche |
| `foto` | string | ⚠️ Opcional | URL o path de la foto del enganche (1 sola foto) |

## ⚠️ IMPORTANTE: Formato del Objeto `enganche`

**El objeto `enganche` DEBE enviarse como un objeto anidado, NO con prefijos:**

✅ **CORRECTO** (objeto anidado):
```json
{
  "enganche": {
    "marca_id": "ID_MARCA",
    "modelo": "Modelo",
    "placa": "PLACA123"
  }
}
```

❌ **INCORRECTO** (con prefijos - será rechazado):
```json
{
  "enganche_marca_id": "ID_MARCA",
  "enganche_modelo": "Modelo",
  "enganche_placa": "PLACA123"
}
```

## Notas Importantes

1. **Validación Automática**: El sistema verifica automáticamente si el `tipovehiculo_id` corresponde a un vehículo tipo "ARTICULADO" (comparación case-insensitive).

2. **Creación/Actualización del Enganche**: 
   - Si el objeto `enganche` está presente y el vehículo es ARTICULADO, el sistema:
     - Busca si ya existe un enganche con la misma placa
     - Si existe, lo actualiza con los nuevos datos
     - Si no existe, crea un nuevo enganche
   - La `placa_enganche` se asigna automáticamente al `resumevehiculo` con el valor de `enganche.placa`

3. **Campos Automáticos**: Los siguientes campos del enganche se copian automáticamente del vehículo:
   - `propietario_id`
   - `tenedor_id`
   - `user_id`

4. **No incluir `placa_enganche` manualmente**: Si envías el objeto `enganche`, NO debes incluir `placa_enganche` en el nivel raíz del payload, ya que se asigna automáticamente.

5. **Documentos del Enganche**: Los documentos del enganche se deben enviar en el array `documentosenganche`, y el campo `placa_enganche` se puede dejar vacío ya que se asignará automáticamente después de crear el enganche.

## Ejemplo de Payload Mínimo para Vehículo ARTICULADO

```json
{
  "fotos": ["url_foto.jpg"],
  "placa": "ABC123",
  "tipovehiculo_id": "ID_TIPO_ARTICULADO",
  "marca_id": "ID_MARCA",
  "ano_id": "ID_ANO",
  "modelo_id": "ID_MODELO",
  "modelo": "Modelo Vehículo",
  "color_id": "ID_COLOR",
  "tipocarroceria_id": "ID_TIPO_CARROCERIA",
  "clasevehiculo_id": "ID_CLASE",
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
  "ruta_frecuente": "Ruta",
  "enganche": {
    "marca_id": "ID_MARCA_ENGANCHE",
    "modelo": "Modelo Enganche",
    "numero_serie": "SERIE123",
    "color_id": "ID_COLOR_ENGANCHE",
    "tipocarroceria_id": "ID_TIPO_CARROCERIA_ENGANCHE",
    "placa": "PLACA_ENGANCHE",
    "peso": 5000
  },
  "user_id": "ID_USUARIO",
  "status": false
}
```
