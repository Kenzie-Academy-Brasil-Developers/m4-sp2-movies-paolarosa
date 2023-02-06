CREATE DATABASE movies;

CREATE TABLE IF NOT EXISTS movies(
id SERIAL PRIMARY KEY,
name VARCHAR(50) UNIQUE NOT NULL,
description TEXT,
duration INTEGER NOT NULL,
price INTEGER NOT NULL
);

INSERT INTO movies(name, description, duration, price)
VALUES ('Star Wars', 'fiction', 120, 50);