exports.up = function(knex) {
    return knex.schema.createTable('favoritos',table=>{
            table.integer('usuario_id').references('id').inTable('usuarios').notNull()
            table.integer('receita_id').references('id_receita').inTable('receitas').notNull()
        })
}

exports.down = function(knex) {
    return knex.schema.dropTable('favoritos')
}
