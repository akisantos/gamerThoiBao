const dbConfig = require('./../database/dtbConfig');
const dbUtils = require('./../database/dbUtils');
const PostSchema = require('../models/Post');
const sql = require('mssql');

exports.getAllPost = async (filter)=>{
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let query = `SELECT * from ${PostSchema.schemaName}`
    let countQuery = `SELECT COUNT(DISTINCT _id) as totalItem from ${PostSchema.schemaName}`

    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1; // || config Default Size
    if (pageSize> 10){
        pageSize = 10;
    }

    const {filterStr, pageNavigation} = dbUtils.getFilterQuery(PostSchema.schema, filter, page, pageSize, PostSchema.defaultSort);

    console.log(filterStr);
    console.log(pageNavigation);

    if (filterStr){
        query += ' '+ filterStr;
        countQuery += ' ' + filterStr;
    }

    if (pageNavigation){
        query += ' '+ pageNavigation;
    }

    console.log(query);

    let res = await dbConfig.db.pool.request().query(query);
    let countRes = await dbConfig.db.pool.request().query(countQuery);

    let totalItem = 0;
    if (countRes.recordsets[0].length >0){
        totalItem = countRes.recordsets[0][0].totalItem;
    }
    let totalPage = Math.ceil(totalItem/pageSize);

    const posts = res.recordsets[0];

    return{
        page,
        pageSize,
        totalPage,
        totalItem,
        posts: posts
    }
}