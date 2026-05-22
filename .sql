-- Скрипт создания базы данных
-- Веб-приложение для управления личными финансами

CREATE TABLE IF NOT EXISTS users (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  name     TEXT NOT NULL,
  email    TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  amount      REAL NOT NULL,
  description TEXT,
  date        TEXT,
  user_id     INTEGER,
  category_id INTEGER,
  FOREIGN KEY (user_id)     REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT NOT NULL,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS expense_tags (
  expense_id INTEGER,
  tag_id     INTEGER,
  FOREIGN KEY (expense_id) REFERENCES expenses(id),
  FOREIGN KEY (tag_id)     REFERENCES tags(id)
);

-- test

INSERT INTO users (name, email, password) VALUES
('Арсений', 'arseniy@mail.ru', '12345'),
('Иван', 'ivan@mail.ru', '54321');

INSERT INTO categories (name, user_id) VALUES
('Еда', 1),
('Транспорт', 1),
('Развлечения', 1),
('Здоровье', 2);

INSERT INTO expenses (amount, description, date, user_id, category_id) VALUES
(1500, 'Продукты в магазине', '2026-05-10', 1, 1),
(350,  'Метро на неделю',     '2026-05-11', 1, 2),
(2200, 'Кино и кафе',         '2026-05-12', 1, 3),
(800,  'Аптека',              '2026-05-13', 2, 4),
(600,  'Обед',                '2026-05-14', 1, 1);

INSERT INTO tags (name, user_id) VALUES
('важное',   1),
('плановое', 1),
('разовое',  2);

INSERT INTO expense_tags (expense_id, tag_id) VALUES
(1, 1), (2, 2), (3, 3), (4, 1), (5, 2);

-- SQL запросы

-- 1. SELECT с условием
SELECT id, amount, description, date, category_id
FROM expenses
WHERE user_id = 1
ORDER BY date DESC;

-- 2. INSERT
INSERT INTO expenses (amount, description, date, user_id, category_id)
VALUES (1500.00, 'Продукты', '2026-05-10', 1, 2);

-- 3. UPDATE
UPDATE expenses
SET amount = 2000.00, description = 'Продукты и бытовая химия'
WHERE id = 5 AND user_id = 1;

-- 4. DELETE
DELETE FROM expenses
WHERE id = 5 AND user_id = 1;

-- 5. SELECT с JOIN
SELECT e.id, e.amount, e.description, e.date, c.name AS category_name
FROM expenses e
JOIN categories c ON e.category_id = c.id
WHERE e.user_id = 1
ORDER BY e.date DESC;