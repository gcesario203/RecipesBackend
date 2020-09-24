exports.up = function(knex) {
  return knex.schema.createTable('ingredientes', table=>{
      table.increments('id_ingredient').primary()
      table.string('nome_ingrediente').notNull()
      table.string('medida').notNull()
      table.integer('id_receita').references('id_receita').inTable('receitas').notNull()
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('ingredientes')
}
