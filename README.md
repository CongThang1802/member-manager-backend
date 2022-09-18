# /Menber Management

# 2022-07-09

## login admin
## **<font color="blue">Thinking</font>**

# <font color="RED"> Run Migrate</font>

- <p><a href="http://knexjs.org/guide/migrations.html" title="Title"> See More</a></p>

## create migrate

- knex migrate:make migration_create_coin

## run migrate

- npx knex migrate:latest
- npx knex migrate:up 20220630074246_create_coin.js
- npx knex migrate:latest

## run seed

- npx knex seed:run



