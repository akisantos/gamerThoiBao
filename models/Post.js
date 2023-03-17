const DataValidator = require('./ModelSchemaValidator');
const schema = require('./ModelSchema');
const sql = require('mssql');

const PostSchema = new schema(
    {
        _id: new DataValidator({
            name: '_id',
            sqlType: sql.Int
        }),

        _title: new DataValidator({
            name: '_title',
            sqlType: sql.NVarChar,
            required: true,
        }),

        _description: new DataValidator({
            name: '_description',
            sqlType: sql.NVarChar,
        }),

        _thumbnailUrl: new DataValidator({
            name: '_thumbnail_url',
            sqlType: sql.VarChar,
        }),

        _tag: new DataValidator({
            name: '_tags',
            sqlType: sql.NVarChar
        }),

        _status: new DataValidator({
            name: '_status',
            sqlType: sql.Int,
        }),

        createdDate: new DataValidator({
            name: '_cr_date',
            sqlType: sql.DateTime
        }),

        updatedDate: new DataValidator({
            name: '_up_date',
            sqlType: sql.DateTime
        }),

        author: new DataValidator({
            name: '_author',
            sqlType: sql.Int,
        }),
        
        moderator: new DataValidator({
            name: '_moderator',
            sqlType: sql.Int
        }),

        category: new DataValidator({
            name:'_category',
            sqlType: sql.Int
        })


    },'_post','_cr_date'
)

module.exports = PostSchema;