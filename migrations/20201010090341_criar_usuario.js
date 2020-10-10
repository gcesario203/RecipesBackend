exports.up = function(knex) {
    return knex.schema.createTable('usuarios', table=>{
            table.increments('usuario_id').primary()
            table.string('username').notNull()
            table.string('usuario_img_url')
            table.string('email').notNull()
            table.string('senha').notNull()
            table.boolean('admin').notNull().defaultTo(false)
        })
}

exports.down = function(knex) {
    return knex.schema.dropTable('usuarios')
}
