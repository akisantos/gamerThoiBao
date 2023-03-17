const dotenv = require('dotenv');
dotenv.config({
    path:'./config.env'
})

const sql = require('mssql');
const dtbConfig = require('./database/dtbConfig')

const app = require('./app');

const appPool = new sql.ConnectionPool(dtbConfig.sqlConfig);

appPool.connect()
    .then((pool)=>{
        console.log("Connected to dtb.")
        dtbConfig.db.pool = pool;
    })
    .catch(function(err) {
        console.error('Error creating connection pool', err)
    });

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Listening on port" ${PORT}`)
})