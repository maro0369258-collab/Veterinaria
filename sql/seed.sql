USE vet_adler;

-- Hashes bcrypt generados con bcryptjs (cost 10) — admin123 / user123 / gan123
INSERT INTO usuarios (nombre, correo, password, telefono, rol) VALUES
('Admin Veterinaria',       'admin@vet.com',    '$2a$10$gA2lI6S6kK0bV5R3yWnE3eFqkXJpKp9XwQjUKkqyRJ9wZcQyR2K/G', NULL,          'admin'),
('Mauricio Almazán García', 'user@vet.com',     '$2a$10$gA2lI6S6kK0bV5R3yWnE3eFqkXJpKp9XwQjUKkqyRJ9wZcQyR2K/G', '5551234567',  'user'),
('Adler Ganadero',          'ganadero@vet.com', '$2a$10$gA2lI6S6kK0bV5R3yWnE3eFqkXJpKp9XwQjUKkqyRJ9wZcQyR2K/G', '5559876543',  'ganadero');

INSERT INTO productos (nombre, categoria, stock, unidad, precio, stock_min) VALUES
('NexGard',               'Antiparasitario', 25, 'tableta', 350, 5),
('Vacuna Triple Felina',  'Vacuna',          15, 'dosis',   280, 5),
('Alimento Premium Perro 15kg', 'Alimento',   8, 'bulto',   980, 3);

-- Nota: los hashes anteriores son placeholder. Ejecuta también `npm run migrate`
-- para sobrescribir con hashes válidos generados por bcryptjs.
