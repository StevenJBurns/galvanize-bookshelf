
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", (table) => {
    table.increments();
    table.varchar("first_name", 255).notNullable().defaultTo("");
    table.varchar("last_name", 255).notNullable().defaultTo("");
    table.varchar("email", 255).unique().notNullable();
    table.specificType("hashed_password", "char(60)").notNullable();
    table.timestamp("created_at").notNullable("").defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable("").defaultTo(knex.fn.now());
  })
};

exports.down = (knex, Promise) => knex.schema.dropTable("users");
