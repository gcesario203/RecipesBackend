exports.up = function(knex) {
    return knex.schema.createTable('ingredientes', table=>{
        table.increments('ingrediente_id').primary()
        table.string('nome_ingrediente').notNull()
        table.string('ingrediente_img_url')
        table.string('medida').notNull()
        table.integer('receita_id').unsigned().references('receita_id').inTable('receitas').notNull()
    })
  }
  
  exports.down = function(knex) {
    return knex.schema.dropTable('ingredientes')
  }
  