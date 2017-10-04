
exports.up = function(knex, Promise) {
  return knex.schema.createTable("books", (table) => {
    table.increments();
    table.varchar("title", 255).notNullable().defaultTo("");
    table.varchar("author", 255).notNullable().defaultTo("");
    table.varchar("genre", 255).notNullable().defaultTo("");
    table.text("description").notNullable().defaultTo("");
    table.text("cover_url").notNullable().defaultTo("");
    table.timestamp("created_at").notNullable("").defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable("").defaultTo(knex.fn.now());
  })
};

exports.down = (knex, Promise) => knex.schema.dropTable("books");
