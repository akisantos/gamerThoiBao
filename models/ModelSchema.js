class ModelSchema{
    constructor(schema, schemaName, defaultSort){
        this.schema = schema;
        this.schemaName = schemaName;
        this.defaultSort = defaultSort;
    }

    validateData(data){
        for (let fieldName in this.schema){
            let value = data[fieldName];
            let field = this.schema[fieldName];
            let {isValid, err} = field.validate(value);

            if (!isValid){
                throw new Error('Invalid data at field' + fieldName +'. ' +err);

            } 

            if (value === undefined || value === null){
                data[fieldName] = field.default;
            }
        }

        return data;
    }
}

module.exports = ModelSchema;