exports.up = function(knex ) {
  return knex.schema.createTable('categorias', table=>{
      table.increments('id_categoria').primary()
      table.string('nome_categoria').notNull()
  })
}

exports.down = function(knex, ) {
  return knex.schema.dropTable('categorias')
}
