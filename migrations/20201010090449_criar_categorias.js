exports.up = function(knex ) {
    return knex.schema.createTable('categorias', table=>{
        table.increments('categoria_id').primary()
        table.string('nome_categoria').notNull()
    })
  }
  
  exports.down = function(knex, ) {
    return knex.schema.dropTable('categorias')
  }
  