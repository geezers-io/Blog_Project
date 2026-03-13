INSERT INTO categories (id, name) SELECT RANDOM_UUID(), '기술' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '기술');
INSERT INTO categories (id, name) SELECT RANDOM_UUID(), '일상' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '일상');
INSERT INTO categories (id, name) SELECT RANDOM_UUID(), '음악' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '음악');
INSERT INTO categories (id, name) SELECT RANDOM_UUID(), '영화' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '영화');
INSERT INTO categories (id, name) SELECT RANDOM_UUID(), '여행' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = '여행');
