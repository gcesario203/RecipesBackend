
exports.up = function(knex) {
    return knex.schema.createTable('categorizar', table=>{
        table.increments('id_categorizar').primary()
        table.integer('receita_id').unsigned().references('receita_id').inTable('receitas').notNull()
        table.integer('categoria_id').unsigned().references('categoria_id').inTable('categorias').notNull()
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('categorizar')
};
