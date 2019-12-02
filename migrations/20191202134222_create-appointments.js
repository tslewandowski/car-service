exports.up = async knex =>
  knex.schema.createTable("appointments", table => {
    table.increments();
    table.string("status").notNullable();
    table.datetime("start").notNullable();
    table.datetime("end").notNullable();
    table.integer("price").notNullable();
    table.index("start");
    table.index("end");
  });

exports.down = async knex => knex.schema.dropTable("appointments");
