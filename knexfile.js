// Update with your config settings.
module.exports = {
  client: 'postgres',
  connection:{
    host: '127.0.0.1',
    port: 5432,
    database: 'recipe',
    user:'postgres',
    password:'gabriel203'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
  }

};
