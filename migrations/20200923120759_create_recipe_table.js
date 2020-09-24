exports.up = function(knex) {
    return knex.schema.createTable('receitas', table=>{
            table.increments('id_receita').primary()
            table.string('nome_receita').notNull()
            table.string('modo_preparo').notNull()
            table.string('local_origem').notNull()
            table.timestamp('tempo_preparo', { precision: 6 }).defaultTo(knex.fn.now(6))
            table.integer('usuario_id').references('id').inTable('usuarios').notNull()
            table.integer('id_categoria').references('id_categoria').inTable('categorias').notNull()
        })
}

exports.down = function(knex,) {
    return knex.schema.dropTable('receitas') 
}
