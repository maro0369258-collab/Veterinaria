# Caso 01 — Registro de usuario

- Precondición: Servidores levantados (backend en :4000, frontend en :8081)
- Pasos:
  1. Abrir la página de inicio `/`
  2. Seleccionar `Registrarse`
  3. Completar Nombre, Correo, Contraseña y Teléfono
  4. Enviar formulario
- Resultado esperado: Usuario creado y redirigido a `/admin` (o mensaje de confirmación)
- Evidencia: captura de pantalla de la página luego del registro y respuesta del endpoint (`/api/auth/register`).
