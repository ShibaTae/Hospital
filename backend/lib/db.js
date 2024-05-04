let pg = require('pg');
let connect = pg.creteConnection({
    host : "localhost",
    user : "postgres",
    password : "1234",
    database : "postgres"
})