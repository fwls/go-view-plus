const config = {
    expiresIn: '30d',
    secretKey: 'gVdS',
    uploadPath: 'upload',
    port: 3000,
    // dbClient: 'mysql',
    // dbConnection: {
    //     host: '127.0.0.1',
    //     port: 3306,
    //     user: 'root',
    //     password: 'root',
    //     database: 'goview',
    // }
    dbClient: 'better-sqlite3',
    dbConnection: {
        filename: './mydb.sqlite',
    }
}


module.exports = config