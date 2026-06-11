# Caso 03 — Crear pedido

- Precondición: Hay al menos un producto con stock > 0 en la base de datos.
- Pasos:
  1. Desde la UI o usando `POST /api/pedidos` crear un pedido con items: [{ producto_id, cantidad }]
  2. Confirmar respuesta 200 y `id` del pedido
  3. Verificar en la BD que `pedido_items` se insertaron y el `stock` se decrementó
- Resultado esperado: Pedido creado, stock actualizado, total correcto.
- Evidencia: captura de respuesta, consulta SQL antes/después.
