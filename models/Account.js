const DataValidator = require('./ModelSchemaValidator');
const schema = require('./ModelSchema');
const sql = require('mssql');

const AccountSchema = new schema({
    _id: new DataValidator({
        name: '_id',
        sqlType: sql.Int
    }),
    _login: new DataValidator({
        name: '_login',
        sqlType: sql.VarChar
    }),

    _password: new DataValidator({
        name: '_password',
        sqlType: sql.VarChar
    }),

    _role: new DataValidator({
        name: '_role',
        sqlType: sql.Int
    }),

    _active: new DataValidator({
        name: '_active',
        sqlType: sql.Bit
    })

    
},'_account', '_id')


module.exports = AccountSchema;