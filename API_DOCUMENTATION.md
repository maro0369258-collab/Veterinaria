# 📚 Documentación de API - Veterinaria REST

## Base URL
```
http://localhost:3000/api
```

## Autenticación
Todos los endpoints requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## 🔐 Autenticación

### Registrar Usuario
```http
POST /auth/registrar
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "password123",
  "telefono": "0987654321",
  "rol": "cliente"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "contraseña": "password123"
}
```

**Respuesta (200):**
```json
{
  "message": "Inicio de sesión exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🐾 Mascotas

### Obtener Mascotas
```http
GET /mascotas
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "total": 2,
  "mascotas": [
    {
      "id": 1,
      "nombre": "Firulais",
      "especie": "perro",
      "raza": "Labrador",
      "peso": 30.5,
      "fecha_nacimiento": "2020-05-15",
      "propietario_id": 1,
      "estado": "activo"
    }
  ]
}
```

### Crear Mascota
```http
POST /mascotas
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Firulais",
  "especie": "perro",
  "raza": "Labrador",
  "peso": 30.5,
  "fecha_nacimiento": "2020-05-15"
}
```

**Respuesta (201):**
```json
{
  "message": "Mascota creada exitosamente",
  "mascota": {
    "id": 1,
    "nombre": "Firulais",
    "especie": "perro",
    "propietario_id": 1
  }
}
```

### Actualizar Mascota
```http
PUT /mascotas/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Firulais Actualizado",
  "raza": "Labrador Retriever",
  "peso": 32.0
}
```

### Eliminar Mascota
```http
DELETE /mascotas/:id
Authorization: Bearer <token>
```

---

## 📅 Citas

### Obtener Citas
```http
GET /citas
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "total": 1,
  "citas": [
    {
      "id": 1,
      "mascota_id": 1,
      "mascota_nombre": "Firulais",
      "veterinario_id": 2,
      "veterinario_nombre": "Dr. Juan Pérez",
      "cliente_id": 1,
      "servicio_id": 1,
      "servicio_nombre": "Consulta General",
      "fecha_cita": "2024-01-20 10:00:00",
      "estado": "programada"
    }
  ]
}
```

### Crear Cita
```http
POST /citas
Authorization: Bearer <token>
Content-Type: application/json

{
  "mascota_id": 1,
  "veterinario_id": 2,
  "servicio_id": 1,
  "fecha_cita": "2024-01-20 10:00:00"
}
```

**Respuesta (201):**
```json
{
  "message": "Cita creada exitosamente",
  "cita": {
    "id": 1
  }
}
```

### Actualizar Cita (Solo Veterinario/Admin)
```http
PUT /citas/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "estado": "completada",
  "notas": "Mascota en buen estado"
}
```

### Cancelar Cita
```http
DELETE /citas/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "motivo_cancelacion": "Cambio de horario del cliente"
}
```

---

## 🏥 Servicios

### Obtener Servicios
```http
GET /servicios
```

**Respuesta (200):**
```json
{
  "total": 5,
  "servicios": [
    {
      "id": 1,
      "nombre": "Consulta General",
      "descripcion": "Consulta veterinaria general",
      "precio": 50.00,
      "duracion_minutos": 30,
      "estado": "activo"
    }
  ]
}
```

---

## 👨‍⚕️ Veterinarios

### Obtener Veterinarios
```http
GET /veterinarios
```

**Respuesta (200):**
```json
{
  "total": 1,
  "veterinarios": [
    {
      "id": 2,
      "nombre": "Dr. Juan Pérez",
      "email": "juan@veterinaria.com",
      "telefono": "0987654322"
    }
  ]
}
```

---

## 👤 Usuarios

### Obtener Perfil
```http
GET /usuarios/perfil
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "message": "Datos del perfil",
  "usuario": {
    "id": 1,
    "email": "juan@example.com",
    "rol": "cliente"
  }
}
```

---

## 🆘 Códigos de Error

| Código | Significado |
|--------|------------|
| 200 | OK |
| 201 | Creado |
| 400 | Solicitud inválida |
| 401 | No autenticado |
| 403 | Acceso prohibido |
| 404 | No encontrado |
| 500 | Error del servidor |

---

## 📝 Ejemplos cURL

### Registrarse
```bash
curl -X POST http://localhost:3000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "contraseña": "password123",
    "telefono": "0987654321"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "contraseña": "password123"
  }'
```

### Obtener Mascotas
```bash
curl -X GET http://localhost:3000/api/mascotas \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Crear Mascota
```bash
curl -X POST http://localhost:3000/api/mascotas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais",
    "especie": "perro",
    "raza": "Labrador",
    "peso": 30.5,
    "fecha_nacimiento": "2020-05-15"
  }'
```

---

## 🌐 WebSocket Events

La aplicación soporta eventos en tiempo real vía Socket.io:

### Conectar
```javascript
const socket = io('http://localhost:3000');
```

### Eventos
```javascript
// Nueva cita
socket.emit('nueva_cita', { cita_id: 1 });

// Actualización de estado de mascota
socket.emit('estado_mascota', { mascota_id: 1, estado: 'consultado' });

// Escuchar actualizaciones
socket.on('cita_actualizada', (data) => {
  console.log('Cita actualizada:', data);
});

socket.on('mascota_actualizada', (data) => {
  console.log('Mascota actualizada:', data);
});
```

---

**Última actualización:** Junio 2026  
**Versión API:** 1.0.0
