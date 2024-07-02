const config = require('../config')

const knex = require('knex')({
    client: config.dbClient,
    connection: config.dbConnection,
    useNullAsDefault: true,
    pool: { min: 0, max: 7 },
  })


module.exports = knex