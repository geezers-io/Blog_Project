MERGE INTO categories (id, name) KEY (name) VALUES (RANDOM_UUID(), '기술');
MERGE INTO categories (id, name) KEY (name) VALUES (RANDOM_UUID(), '일상');
MERGE INTO categories (id, name) KEY (name) VALUES (RANDOM_UUID(), '음악');
MERGE INTO categories (id, name) KEY (name) VALUES (RANDOM_UUID(), '영화');
MERGE INTO categories (id, name) KEY (name) VALUES (RANDOM_UUID(), '여행');
