exports.up = function(knex) {
    return knex.schema.createTable('receitas', table=>{
            table.increments('receita_id').primary()
            table.string('nome_receita').notNull()
            table.string('modo_preparo').notNull()
            table.string('local_origem').notNull()
            table.string('receita_img_url')
            table.timestamp('tempo_preparo', { precision: 6 }).defaultTo(knex.fn.now(6))
            table.integer('usuario_id').unsigned().references('usuario_id').inTable('usuarios').notNull()
        })
}

exports.down = function(knex,) {
    return knex.schema.dropTable('receitas') 
}
