# Plan de Pruebas — Proyecto Veterinaria Adler

## Objetivo
Definir los casos y criterios de aceptación para validar la aplicación antes de la entrega.

## Alcance
- Registro / login
- Gestión de mascotas
- Agendar / gestionar citas
- Realizar pedidos y pagos
- Notificaciones (email / WhatsApp) — esquema
- Panel de administración

## Criterios de aceptación
- Cada caso debe incluir: precondición, pasos, datos de entrada, resultado esperado y evidencia (captura/log).

## Casos mínimos obligatorios (5)
1. Registro de usuario y redirección al panel.
2. Inicio de sesión con credenciales válidas.
3. Crear una cita y comprobar que aparece en `Citas`.
4. Crear un pedido con 1 producto y comprobar stock y total.
5. Simular notificación de pago (`/api/payments/test`) y verificar evento en admin.

## Entrega
Colocar evidencias en `docs/casos_prueba/` y completar `docs/reporte_pruebas.md`.
