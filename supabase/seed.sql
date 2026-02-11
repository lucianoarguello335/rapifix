-- ============================================================
-- Rapifix Seed Data
-- ============================================================

-- Categories (25 service categories)
INSERT INTO categories (name, slug, icon, description, sort_order) VALUES
  ('Electricista', 'electricista', '⚡', 'Instalación, reparación y mantenimiento eléctrico', 1),
  ('Plomero / Gasista', 'plomero', '🔧', 'Instalación y reparación de cañerías, agua y gas', 2),
  ('Pintor', 'pintor', '🎨', 'Pintura interior, exterior, decorativa y especial', 3),
  ('Albañil', 'albanil', '🧱', 'Construcción, remodelación y obra civil', 4),
  ('Carpintero', 'carpintero', '🪚', 'Muebles a medida, reparaciones y carpintería general', 5),
  ('Cerrajero', 'cerrajero', '🔑', 'Apertura, cambio de cerraduras y seguridad', 6),
  ('Aire Acondicionado / Calefacción', 'climatizacion', '❄️', 'Instalación y mantenimiento de climatización', 7),
  ('Jardinero / Paisajista', 'jardinero', '🌿', 'Diseño, mantenimiento de jardines y espacios verdes', 8),
  ('Limpieza', 'limpieza', '🧹', 'Limpieza profesional de hogares y oficinas', 9),
  ('Mudanzas / Fletes', 'mudanzas', '📦', 'Servicio de mudanzas, fletes y transporte', 10),
  ('Técnico en Electrodomésticos', 'electrodomesticos', '🔌', 'Reparación de heladeras, lavarropas, hornos y más', 11),
  ('Vidriería', 'vidrieria', '🪟', 'Vidrios, cristales, mamparas y espejos', 12),
  ('Pisos y Revestimientos', 'pisos', '🏗️', 'Colocación de cerámicos, porcelanatos y pisos', 13),
  ('Techista / Impermeabilización', 'techista', '🏠', 'Reparación de techos, goteras e impermeabilización', 14),
  ('Control de Plagas', 'plagas', '🐛', 'Fumigación y control de plagas domésticas', 15),
  ('Herrería / Soldadura', 'herreria', '⚙️', 'Rejas, portones, estructuras metálicas y soldadura', 16),
  ('Durlock / Construcción en Seco', 'durlock', '🪵', 'Cielorrasos, tabiques y revestimientos en durlock', 17),
  ('Marmolería', 'marmoleria', '🪨', 'Mesadas, pisos y revestimientos en mármol y granito', 18),
  ('Cortinas y Persianas', 'cortinas', '🪟', 'Instalación y reparación de cortinas y persianas', 19),
  ('Seguridad / Cámaras / Alarmas', 'seguridad', '📹', 'Sistemas de seguridad, cámaras y alarmas', 20),
  ('Técnico en PC / Redes', 'informatica', '💻', 'Reparación de computadoras, redes y soporte técnico', 21),
  ('Instalación de Gas', 'gasista', '🔥', 'Instalación y mantenimiento de instalaciones de gas', 22),
  ('Piletas / Piscinas', 'piletas', '🏊', 'Construcción, limpieza y mantenimiento de piletas', 23),
  ('Tapicería', 'tapiceria', '🛋️', 'Tapizado y restauración de muebles', 24),
  ('Fumigación', 'fumigacion', '🧪', 'Fumigación profesional y desinfección', 25);

-- Neighborhoods (~45 barrios organized by zone)
INSERT INTO neighborhoods (name, slug, zone, lat, lng) VALUES
  -- Centro
  ('Centro', 'centro', 'Centro', -31.4201, -64.1888),
  ('Nueva Córdoba', 'nueva-cordoba', 'Centro', -31.4271, -64.1856),
  ('Güemes', 'guemes', 'Centro', -31.4250, -64.1810),
  ('Alberdi', 'alberdi', 'Centro', -31.4150, -64.1960),
  ('San Vicente', 'san-vicente', 'Centro', -31.4130, -64.1810),
  ('General Paz', 'general-paz', 'Centro', -31.4100, -64.1780),
  ('Alta Córdoba', 'alta-cordoba', 'Centro', -31.4050, -64.1850),
  ('Cofico', 'cofico', 'Centro', -31.4070, -64.1900),
  ('Observatorio', 'observatorio', 'Centro', -31.4220, -64.1930),
  ('Juniors', 'juniors', 'Centro', -31.4190, -64.1950),
  ('Bella Vista', 'bella-vista', 'Centro', -31.4120, -64.1720),

  -- Norte
  ('Cerro de las Rosas', 'cerro-de-las-rosas', 'Norte', -31.3850, -64.2300),
  ('Villa Belgrano', 'villa-belgrano', 'Norte', -31.3700, -64.2400),
  ('Argüello', 'arguello', 'Norte', -31.3550, -64.2500),
  ('Urca', 'urca', 'Norte', -31.3900, -64.2200),
  ('Tablada Park', 'tablada-park', 'Norte', -31.3950, -64.2100),
  ('Colinas de Vélez Sársfield', 'colinas-de-velez-sarsfield', 'Norte', -31.3800, -64.2150),

  -- Sur
  ('Barrio Jardín', 'barrio-jardin', 'Sur', -31.4500, -64.1900),
  ('San Fernando', 'san-fernando', 'Sur', -31.4600, -64.1850),
  ('Inaudi', 'inaudi', 'Sur', -31.4700, -64.1800),
  ('Cabildo', 'cabildo', 'Sur', -31.4550, -64.1750),
  ('Ampliación Residencial América', 'ampliacion-residencial-america', 'Sur', -31.4650, -64.1700),

  -- Este
  ('Barrio Pueyrredón', 'barrio-pueyrredon', 'Este', -31.4180, -64.1650),
  ('San Martín', 'san-martin', 'Este', -31.4250, -64.1600),
  ('Empalme', 'empalme', 'Este', -31.4350, -64.1550),
  ('Ferreyra', 'ferreyra', 'Este', -31.4400, -64.1500),
  ('Ituzaingó', 'ituzaingo', 'Este', -31.4300, -64.1580),

  -- Oeste
  ('Marqués de Sobremonte', 'marques-de-sobremonte', 'Oeste', -31.4050, -64.2050),
  ('Yofre', 'yofre', 'Oeste', -31.4000, -64.2100),
  ('Villa Cabrera', 'villa-cabrera', 'Oeste', -31.4020, -64.2000),
  ('Jardín Espinosa', 'jardin-espinosa', 'Oeste', -31.3980, -64.2080),
  ('Parque Vélez Sársfield', 'parque-velez-sarsfield', 'Oeste', -31.4080, -64.2030),

  -- Sierras Chicas
  ('Unquillo', 'unquillo', 'Sierras Chicas', -31.2300, -64.3200),
  ('Río Ceballos', 'rio-ceballos', 'Sierras Chicas', -31.1700, -64.3300),
  ('Mendiolaza', 'mendiolaza', 'Sierras Chicas', -31.2800, -64.3000),
  ('Salsipuedes', 'salsipuedes', 'Sierras Chicas', -31.1400, -64.3000),
  ('La Calera', 'la-calera', 'Sierras Chicas', -31.3400, -64.3400),

  -- Additional neighborhoods
  ('Residencial Vélez Sársfield', 'residencial-velez-sarsfield', 'Oeste', -31.4100, -64.2100),
  ('Villa Rivera Indarte', 'villa-rivera-indarte', 'Norte', -31.3400, -64.2600),
  ('Los Boulevares', 'los-boulevares', 'Norte', -31.3600, -64.2300),
  ('Poeta Lugones', 'poeta-lugones', 'Norte', -31.3750, -64.2250),
  ('Jardín del Pilar', 'jardin-del-pilar', 'Norte', -31.3650, -64.2350),
  ('Barrio Maipú', 'barrio-maipu', 'Este', -31.4280, -64.1620),
  ('Alto Alberdi', 'alto-alberdi', 'Centro', -31.4100, -64.2000),
  ('Rogelio Martínez', 'rogelio-martinez', 'Norte', -31.3900, -64.2180);
