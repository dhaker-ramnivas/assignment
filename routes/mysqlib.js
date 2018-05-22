var mysql = require('mysql');
var config    = require('config');

var db_config = {
    host: config.get('databaseSettings.host'),
    user: config.get('databaseSettings.user'),
    password: config.get('databaseSettings.password'),
    database: config.get('databaseSettings.database'),
    multipleStatements: true,

};

function initializeConnectionPool(db_config){
    var numConnectionsInPool = 0;
    console.log('CALLING INITIALIZE POOL');
    var conn = mysql.createPool(db_config);
    conn.on('connection', function (connection) {
        numConnectionsInPool++;
        console.log('CONNECTION IN POOL : ', numConnectionsInPool);
    });
    conn.on('error', function (error) {
        console.log('ERROR IN CONNECTION IN POOL : ', error);
        console.log(error);
        return initializeConnectionPool(db_config);
    });
  
    return conn;
}

connection = initializeConnectionPool(db_config);
