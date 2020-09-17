exports.up = function(knex) {
    return knex.schema.createTable('usuarios', table=>{
            table.increments('id').primary()
            table.string('username').notNull()
            table.string('email').notNull()
            table.string('senha').notNull()
            table.boolean('admin').notNull().defaultTo(false)
        })
}

exports.down = function(knex) {
    return knex.schema.dropTable('usuarios')
}
