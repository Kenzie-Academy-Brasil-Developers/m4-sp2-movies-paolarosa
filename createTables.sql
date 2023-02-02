CREATE DATABASE movies;

CREATE TABLE IF NOT EXISTS movies(
id SERIAL primary KEY,
name VARCHAR(50) unique not null,
description text,
duration INTEGER not null,
price INTEGER not NULL
);

INSERT INTO movies(name, description, duration, price)
VALUES ('Star Wars', 'fiction', 120, 50);