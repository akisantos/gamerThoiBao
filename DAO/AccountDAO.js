
const dbConfig = require('./../database/dtbConfig');
const dbUtils = require('./../database/dbUtils');
const AccountSchema = require('../models/Account');
const sql = require('mssql');

exports.getAllAccount = async (req,res) =>{
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    if (!acc){
        throw new Error('Invalid input account to regist');
    }


}

exports.findDuplicate = async (user) =>{
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    if (!user){
        throw new Error('Invalid input user to find');

    }


    let query = `SELECT * FROM ${AccountSchema.schemaName}`
    query += ` WHERE _login = '${user}'`

    let res = await dbConfig.db.pool.request().query(query);

  
    return res.recordsets;
}

//CRUD
exports.registerNewAccount  = async (acc) =>{
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    if (!acc){
        throw new Error('Invalid input account to regist');
    }
    var modiFiedAcc = acc;

    modiFiedAcc = {'_id': 1,...modiFiedAcc}
    let insertData = AccountSchema.validateData(modiFiedAcc);

    const {request, insertedFieldNameStr, insertValueStr} = dbUtils.getInsertQuery(AccountSchema.schema, dbConfig.db.pool.request(), insertData); 
    //console.log(insertedFieldNameStr,insertValueStr)
    //let query = `set identity_insert ${AccountSchema.schemaName} ON INSERT INTO ${AccountSchema.schemaName}` + '('+ insertedFieldNameStr +') values (' + insertValueStr + ')';


    let query = `set identity_insert ${AccountSchema.schemaName} ON INSERT INTO ${AccountSchema.schemaName}`;
    query += '(_login, _password, _role, _active) values' + '("' +insertData._login +'","' + insertData._password +'",'+ insertData._role+','+ insertData._active +')'
    console.log(query);
    let res = await request.query(query);
    return res.recordsets;
}