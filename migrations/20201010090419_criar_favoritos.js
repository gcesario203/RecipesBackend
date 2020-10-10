exports.up = function(knex) {
    return knex.schema.createTable('favoritos',table=>{
            table.increments('id_favorito').primary()
            table.integer('usuario_id').unsigned().references('usuario_id').inTable('usuarios').notNull()
            table.integer('receita_id').unsigned().references('receita_id').inTable('receitas').notNull()
        })
}

exports.down = function(knex) {
    return knex.schema.dropTable('favoritos')
}
