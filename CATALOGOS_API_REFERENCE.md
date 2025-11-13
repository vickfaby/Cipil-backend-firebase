# API Reference - Catálogos del Sistema

Esta documentación describe cómo usar los endpoints de catálogos disponibles en el backend para el componente "Datos del sistema".

## Configuración General

Todos los endpoints requieren autenticación con token Bearer de Firebase.

```javascript
// Configuración de headers
const headers = {
  'Authorization': `Bearer ${firebaseToken}`,
  'Content-Type': 'application/json'
};
```

---

## 1. Tipos de Documento

**Base URL:** `/tipodocumentos`

### Obtener todos los tipos de documento
```javascript
GET /tipodocumentos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipodocumentos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un tipo de documento por ID
```javascript
GET /tipodocumentos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipodocumentos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un tipo de documento
```javascript
POST /tipodocumentos

// Body - CAMPOS REQUERIDOS
{
  "nombre_tipodocumento": "Cédula de Ciudadanía",    // string, mínimo 1 carácter (REQUERIDO)
  "detalle_tipodocumento": "Documento de identidad nacional"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipodocumentos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_tipodocumento: "Cédula de Ciudadanía",
    detalle_tipodocumento: "Documento de identidad nacional"
  })
});
const data = await response.json();
```

### Actualizar un tipo de documento
```javascript
PATCH /tipodocumentos/:id

// Body (parcial)
{
  "nombre_tipodocumento": "Cédula de Ciudadanía Actualizada"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipodocumentos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_tipodocumento: "Cédula de Ciudadanía Actualizada"
  })
});
const data = await response.json();
```

### Eliminar un tipo de documento
```javascript
DELETE /tipodocumentos/:id

// Ejemplo (eliminación lógica)
const response = await fetch(`${API_BASE_URL}/tipodocumentos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 2. Categorías

**Base URL:** `/categorias`

### Obtener todas las categorías
```javascript
GET /categorias

// Ejemplo
const response = await fetch(`${API_BASE_URL}/categorias`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener una categoría por ID
```javascript
GET /categorias/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear una categoría
```javascript
POST /categorias

// Body - CAMPOS REQUERIDOS
{
  "nombre_categoria": "Vehículos de Carga"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/categorias`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_categoria: "Vehículos de Carga"
  })
});
const data = await response.json();
```

### Actualizar una categoría
```javascript
PATCH /categorias/:id

// Body (parcial) - Todos los campos son opcionales
{
  "nombre_categoria": "Vehículos de Carga Pesada"  // string, mínimo 1 carácter (OPCIONAL)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_categoria: "Vehículos de Carga Pesada"
  })
});
const data = await response.json();
```

### Eliminar una categoría
```javascript
DELETE /categorias/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 3. Entidades Emisoras

**Base URL:** `/entidadesemisoras`

### Obtener todas las entidades emisoras
```javascript
GET /entidadesemisoras

// Ejemplo
const response = await fetch(`${API_BASE_URL}/entidadesemisoras`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener una entidad emisora por ID
```javascript
GET /entidadesemisoras/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/entidadesemisoras/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear una entidad emisora
```javascript
POST /entidadesemisoras

// Body - CAMPOS REQUERIDOS
{
  "nombre_entidad": "Registraduría Nacional",  // string, mínimo 1 carácter (REQUERIDO)
  "telefono_entidad": 6011234567,  // number, sin comillas (REQUERIDO)
  "direccion_entidad": "Calle 26 #51-50",  // string, mínimo 1 carácter (REQUERIDO)
  "ciudad_entidad": "Bogotá"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/entidadesemisoras`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_entidad: "Registraduría Nacional",
    telefono_entidad: 6011234567,
    direccion_entidad: "Calle 26 #51-50",
    ciudad_entidad: "Bogotá"
  })
});
const data = await response.json();
```

### Actualizar una entidad emisora
```javascript
PATCH /entidadesemisoras/:id

// Body (parcial)
{
  "nombre_entidad": "Registraduría Nacional del Estado Civil"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/entidadesemisoras/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_entidad: "Registraduría Nacional del Estado Civil"
  })
});
const data = await response.json();
```

### Eliminar una entidad emisora
```javascript
DELETE /entidadesemisoras/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/entidadesemisoras/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 4. Grupos de Documento

**Base URL:** `/grupodocumentos`

### Obtener todos los grupos de documento
```javascript
GET /grupodocumentos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/grupodocumentos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un grupo de documento por ID
```javascript
GET /grupodocumentos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/grupodocumentos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un grupo de documento
```javascript
POST /grupodocumentos

// Body - CAMPOS REQUERIDOS
{
  "nombre_documento": "Documentos Personales"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/grupodocumentos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_documento: "Documentos Personales"
  })
});
const data = await response.json();
```

### Actualizar un grupo de documento
```javascript
PATCH /grupodocumentos/:id

// Body (parcial) - Todos los campos son opcionales
{
  "nombre_documento": "Documentos de Identificación Personal"  // string, mínimo 1 carácter (OPCIONAL)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/grupodocumentos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_documento: "Documentos de Identificación Personal"
  })
});
const data = await response.json();
```

### Eliminar un grupo de documento
```javascript
DELETE /grupodocumentos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/grupodocumentos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 5. Tipos de Persona

**Base URL:** `/tipopersona`

### Obtener todos los tipos de persona
```javascript
GET /tipopersona

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipopersona`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un tipo de persona por ID
```javascript
GET /tipopersona/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipopersona/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un tipo de persona
```javascript
POST /tipopersona

// Body - CAMPOS REQUERIDOS
{
  "nombre_tipopersona": "Persona Natural"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipopersona`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_tipopersona: "Persona Natural"
  })
});
const data = await response.json();
```

### Actualizar un tipo de persona
```javascript
PATCH /tipopersona/:id

// Body (parcial)
{
  "detalle_tipopersona": "Persona física, individuo con derechos y obligaciones"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipopersona/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_tipopersona: "Persona física, individuo con derechos y obligaciones"
  })
});
const data = await response.json();
```

### Eliminar un tipo de persona
```javascript
DELETE /tipopersona/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipopersona/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 6. Sexo

**Base URL:** `/sexo`

### Obtener todos los tipos de sexo
```javascript
GET /sexo

// Ejemplo
const response = await fetch(`${API_BASE_URL}/sexo`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un tipo de sexo por ID
```javascript
GET /sexo/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/sexo/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un tipo de sexo
```javascript
POST /sexo

// Body - CAMPOS REQUERIDOS
{
  "nombre_sexo": "Masculino"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/sexo`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_sexo: "Masculino"
  })
});
const data = await response.json();
```

### Actualizar un tipo de sexo
```javascript
PATCH /sexo/:id

// Body (parcial)
{
  "detalle_sexo": "Sexo masculino"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/sexo/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_sexo: "Sexo masculino"
  })
});
const data = await response.json();
```

### Eliminar un tipo de sexo
```javascript
DELETE /sexo/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/sexo/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 7. Tipos de Relación

**Base URL:** `/tiporelaciones`

### Obtener todos los tipos de relación
```javascript
GET /tiporelaciones

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tiporelaciones`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un tipo de relación por ID
```javascript
GET /tiporelaciones/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tiporelaciones/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un tipo de relación
```javascript
POST /tiporelaciones

// Body - CAMPOS REQUERIDOS
{
  "nombre_tiporelacion": "Familiar"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tiporelaciones`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_tiporelacion: "Familiar"
  })
});
const data = await response.json();
```

### Actualizar un tipo de relación
```javascript
PATCH /tiporelaciones/:id

// Body (parcial)
{
  "detalle_tiporelacion": "Relación de parentesco familiar"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tiporelaciones/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_tiporelacion: "Relación de parentesco familiar"
  })
});
const data = await response.json();
```

### Eliminar un tipo de relación
```javascript
DELETE /tiporelaciones/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tiporelaciones/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 8. Tipos de Vehículo

**Base URL:** `/tipovehiculos`

### Obtener todos los tipos de vehículo
```javascript
GET /tipovehiculos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipovehiculos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un tipo de vehículo por ID
```javascript
GET /tipovehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipovehiculos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un tipo de vehículo
```javascript
POST /tipovehiculos

// Body - CAMPOS REQUERIDOS
{
  "nombre_tipovehiculo": "Automóvil"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipovehiculos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_tipovehiculo: "Automóvil"
  })
});
const data = await response.json();
```

### Actualizar un tipo de vehículo
```javascript
PATCH /tipovehiculos/:id

// Body (parcial)
{
  "detalle_tipovehiculo": "Vehículo automotor de uso particular"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipovehiculos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_tipovehiculo: "Vehículo automotor de uso particular"
  })
});
const data = await response.json();
```

### Eliminar un tipo de vehículo
```javascript
DELETE /tipovehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipovehiculos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 9. Marcas de Vehículo

**Base URL:** `/marcasvehiculos`

### Obtener todas las marcas de vehículo
```javascript
GET /marcasvehiculos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/marcasvehiculos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener una marca de vehículo por ID
```javascript
GET /marcasvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/marcasvehiculos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear una marca de vehículo
```javascript
POST /marcasvehiculos

// Body - CAMPOS REQUERIDOS
{
  "nombre_marcavehiculo": "Toyota"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/marcasvehiculos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_marcavehiculo: "Toyota"
  })
});
const data = await response.json();
```

### Actualizar una marca de vehículo
```javascript
PATCH /marcasvehiculos/:id

// Body (parcial)
{
  "detalle_marca": "Fabricante automotriz japonés líder mundial"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/marcasvehiculos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_marca: "Fabricante automotriz japonés líder mundial"
  })
});
const data = await response.json();
```

### Eliminar una marca de vehículo
```javascript
DELETE /marcasvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/marcasvehiculos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 10. Modelos de Vehículo

**Base URL:** `/modelosvehiculos`

### Obtener todos los modelos de vehículo
```javascript
GET /modelosvehiculos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/modelosvehiculos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un modelo de vehículo por ID
```javascript
GET /modelosvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/modelosvehiculos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener modelos por marca y año
```javascript
GET /modelosvehiculos/:marca_vehiculo_id/:marca_vehiculo_ano_id

// Ejemplo
const marcaId = "507f1f77bcf86cd799439011";
const anoId = "507f1f77bcf86cd799439012";

const response = await fetch(
  `${API_BASE_URL}/modelosvehiculos/${marcaId}/${anoId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
```

### Crear un modelo de vehículo
```javascript
POST /modelosvehiculos

// Body - CAMPOS REQUERIDOS
{
  "nombre_modelovehiculo": "Corolla",  // string, mínimo 1 carácter (REQUERIDO)
  "marca_vehiculo_ano_id": "507f1f77bcf86cd799439012",  // string, ID del año (REQUERIDO)
  "marca_vehiculo_id": "507f1f77bcf86cd799439011"  // string, ID de la marca (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/modelosvehiculos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_modelovehiculo: "Corolla",
    marca_vehiculo_ano_id: "507f1f77bcf86cd799439012",
    marca_vehiculo_id: "507f1f77bcf86cd799439011"
  })
});
const data = await response.json();
```

### Actualizar un modelo de vehículo
```javascript
PATCH /modelosvehiculos/:id

// Body (parcial)
{
  "detalle_modelo": "Modelo sedán compacto con alta eficiencia"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/modelosvehiculos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_modelo: "Modelo sedán compacto con alta eficiencia"
  })
});
const data = await response.json();
```

### Eliminar un modelo de vehículo
```javascript
DELETE /modelosvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/modelosvehiculos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 11. Clases de Vehículo

**Base URL:** `/clasesvehiculos`

### Obtener todas las clases de vehículo
```javascript
GET /clasesvehiculos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/clasesvehiculos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener una clase de vehículo por ID
```javascript
GET /clasesvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/clasesvehiculos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear una clase de vehículo
```javascript
POST /clasesvehiculos

// Body - CAMPOS REQUERIDOS
{
  "nombre_clasevehiculo": "Particular",  // string, mínimo 1 carácter (REQUERIDO)
  "detalle_clasevehiculo": "Clase de vehículo de uso personal"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/clasesvehiculos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_clasevehiculo: "Particular",
    detalle_clasevehiculo: "Clase de vehículo de uso personal"
  })
});
const data = await response.json();
```

### Actualizar una clase de vehículo
```javascript
PATCH /clasesvehiculos/:id

// Body (parcial)
{
  "detalle_clasevehiculo": "Clase de vehículo para uso personal y familiar"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/clasesvehiculos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_clasevehiculo: "Clase de vehículo para uso personal y familiar"
  })
});
const data = await response.json();
```

### Eliminar una clase de vehículo
```javascript
DELETE /clasesvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/clasesvehiculos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 12. Colores

**Base URL:** `/colores`

### Obtener todos los colores
```javascript
GET /colores

// Ejemplo
const response = await fetch(`${API_BASE_URL}/colores`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un color por ID
```javascript
GET /colores/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/colores/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un color
```javascript
POST /colores

// Body - CAMPOS REQUERIDOS
{
  "nombre_color": "Rojo",  // string, mínimo 1 carácter (REQUERIDO)
  "detalle_color": "Color rojo brillante"  // string, mínimo 1 carácter (OPCIONAL)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/colores`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_color: "Rojo",
    detalle_color: "Color rojo brillante"
  })
});
const data = await response.json();
```

### Actualizar un color
```javascript
PATCH /colores/:id

// Body (parcial)
{
  "detalle_color": "Color rojo carmesí"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/colores/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_color: "Color rojo carmesí"
  })
});
const data = await response.json();
```

### Eliminar un color
```javascript
DELETE /colores/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/colores/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 13. Tipos de Carrocería

**Base URL:** `/tipocarrocerias`

### Obtener todos los tipos de carrocería
```javascript
GET /tipocarrocerias

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipocarrocerias`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un tipo de carrocería por ID
```javascript
GET /tipocarrocerias/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipocarrocerias/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear un tipo de carrocería
```javascript
POST /tipocarrocerias

// Body - CAMPOS REQUERIDOS
{
  "nombre_tipocarroceria": "Sedán",  // string, mínimo 1 carácter (REQUERIDO)
  "detalle_tipocarroceria": "Carrocería tipo sedán con cuatro puertas"  // string, mínimo 1 carácter (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipocarrocerias`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_tipocarroceria: "Sedán",
    detalle_tipocarroceria: "Carrocería tipo sedán con cuatro puertas"
  })
});
const data = await response.json();
```

### Actualizar un tipo de carrocería
```javascript
PATCH /tipocarrocerias/:id

// Body (parcial)
{
  "detalle_tipocarroceria": "Carrocería sedán de 4 puertas con maletero separado"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipocarrocerias/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_tipocarroceria: "Carrocería sedán de 4 puertas con maletero separado"
  })
});
const data = await response.json();
```

### Eliminar un tipo de carrocería
```javascript
DELETE /tipocarrocerias/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/tipocarrocerias/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 14. Empresas GPS

**Base URL:** `/empresagps`

### Obtener todas las empresas GPS
```javascript
GET /empresagps

// Ejemplo
const response = await fetch(`${API_BASE_URL}/empresagps`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener una empresa GPS por ID
```javascript
GET /empresagps/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/empresagps/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Crear una empresa GPS
```javascript
POST /empresagps

// Body
{
  "nombre_empresa": "GPS Tracking S.A.",
  "direccion": "Calle 123 #45-67",
  "telefono": "+57 300 1234567",
  "pagina_acceso": "https://tracking.example.com"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/empresagps`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_empresa: "GPS Tracking S.A.",
    direccion: "Calle 123 #45-67",
    telefono: "+57 300 1234567",
    pagina_acceso: "https://tracking.example.com"
  })
});
const data = await response.json();
```

### Actualizar una empresa GPS
```javascript
PATCH /empresagps/:id

// Body (parcial)
{
  "telefono": "+57 300 9876543",
  "pagina_acceso": "https://new-tracking.example.com"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/empresagps/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    telefono: "+57 300 9876543",
    pagina_acceso: "https://new-tracking.example.com"
  })
});
const data = await response.json();
```

### Eliminar una empresa GPS
```javascript
DELETE /empresagps/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/empresagps/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## 15. Años de Vehículo

**Base URL:** `/anosvehiculos`

### Obtener todos los años de vehículo
```javascript
GET /anosvehiculos

// Ejemplo
const response = await fetch(`${API_BASE_URL}/anosvehiculos`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener un año de vehículo por ID
```javascript
GET /anosvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/anosvehiculos/${id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Obtener años por marca
```javascript
GET /anosvehiculos/brand/:brand

// Ejemplo
const brandId = "507f1f77bcf86cd799439011";

const response = await fetch(
  `${API_BASE_URL}/anosvehiculos/brand/${brandId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
const data = await response.json();
```

### Crear un año de vehículo
```javascript
POST /anosvehiculos

// Body - CAMPOS REQUERIDOS
{
  "ano": 2024,  // number, sin comillas (REQUERIDO)
  "marcavehiculo_id": "507f1f77bcf86cd799439011"  // string, ID MongoDB de la marca (REQUERIDO)
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/anosvehiculos`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ano: 2024,
    marcavehiculo_id: "507f1f77bcf86cd799439011"
  })
});
const data = await response.json();
```

### Actualizar un año de vehículo
```javascript
PATCH /anosvehiculos/:id

// Body (parcial)
{
  "detalle_ano": "Año modelo 2024 - Última versión"
}

// Ejemplo
const response = await fetch(`${API_BASE_URL}/anosvehiculos/${id}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    detalle_ano: "Año modelo 2024 - Última versión"
  })
});
const data = await response.json();
```

### Eliminar un año de vehículo
```javascript
DELETE /anosvehiculos/:id

// Ejemplo
const response = await fetch(`${API_BASE_URL}/anosvehiculos/${id}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## Manejo de Errores

Todos los endpoints pueden devolver los siguientes códigos de estado HTTP:

- **200**: Operación exitosa (GET, PATCH, DELETE)
- **201**: Recurso creado exitosamente (POST)
- **400**: Solicitud incorrecta (datos inválidos o recurso duplicado)
- **401**: No autorizado (token inválido o expirado)
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

### Ejemplo de manejo de errores

```javascript
try {
  const response = await fetch(`${API_BASE_URL}/categorias`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }

  const result = await response.json();
  console.log('Éxito:', result);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## Notas Importantes

1. **Autenticación**: Todos los endpoints requieren un token Bearer de Firebase válido.
2. **Content-Type**: Para operaciones POST y PATCH, usar `Content-Type: application/json`.
3. **Eliminación**: Los DELETE realizan eliminación lógica (soft delete), no física.
4. **IDs**: Todos los IDs de MongoDB son ObjectIds válidos (24 caracteres hexadecimales).
5. **PATCH**: Permite actualización parcial de recursos (solo enviar campos a modificar).
6. **Validación**: El backend valida duplicados por códigos únicos cuando aplica.

---

## Variables de Entorno Sugeridas

```javascript
// .env o config
API_BASE_URL=http://localhost:3000  // Desarrollo
API_BASE_URL=https://api.cipilapp.com  // Producción
```

---

## Resumen Rápido de Campos Requeridos

### Tabla de Referencia para Creación (POST)

| Catálogo | Endpoint | Campos Requeridos |
|----------|----------|-------------------|
| **Tipos de Documento** | `/tipodocumentos` | `nombre_tipodocumento` (string), `detalle_tipodocumento` (string) |
| **Categorías** | `/categorias` | `nombre_categoria` (string) |
| **Entidades Emisoras** | `/entidadesemisoras` | `nombre_entidad` (string), `telefono_entidad` (number), `direccion_entidad` (string), `ciudad_entidad` (string) |
| **Grupos de Documento** | `/grupodocumentos` | `nombre_documento` (string) |
| **Tipos de Persona** | `/tipopersona` | `nombre_tipopersona` (string) |
| **Sexo** | `/sexo` | `nombre_sexo` (string) |
| **Tipos de Relación** | `/tiporelaciones` | `nombre_tiporelacion` (string) |
| **Tipos de Vehículo** | `/tipovehiculos` | `nombre_tipovehiculo` (string) |
| **Marcas de Vehículo** | `/marcasvehiculos` | `nombre_marcavehiculo` (string) |
| **Modelos de Vehículo** | `/modelosvehiculos` | `nombre_modelovehiculo` (string), `marca_vehiculo_ano_id` (string), `marca_vehiculo_id` (string) |
| **Clases de Vehículo** | `/clasesvehiculos` | `nombre_clasevehiculo` (string), `detalle_clasevehiculo` (string) |
| **Colores** | `/colores` | `nombre_color` (string), `detalle_color` (string, opcional) |
| **Tipos de Carrocería** | `/tipocarrocerias` | `nombre_tipocarroceria` (string), `detalle_tipocarroceria` (string) |
| **Empresas GPS** | `/empresagps` | `nombre_empresa` (string), `direccion` (string), `telefono` (string), `pagina_acceso` (string) |
| **Años de Vehículo** | `/anosvehiculos` | `ano` (number), `marcavehiculo_id` (string) |

### Validaciones Comunes

- **Strings**: Todos los campos string requieren mínimo 1 carácter
- **IDs**: Deben ser ObjectId válidos de MongoDB (24 caracteres hexadecimales)
- **Numbers**: Deben ser valores numéricos válidos

### Ejemplo de Payload Incorrecto vs Correcto

**❌ Incorrecto** (nombre de campos equivocados):
```javascript
{
  "nombre": "Vehículos de Carga",
  "descripcion": "Categoría para vehículos"
}
```

**✅ Correcto**:
```javascript
{
  "nombre_categoria": "Vehículos de Carga"
}
```

---

**Última actualización**: Noviembre 2025  
**Versión del API**: 1.0.0

