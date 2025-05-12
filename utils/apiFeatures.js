class ApiFeatures {
    constructor(mongooseQuery, queryObj) {
        this.mongooseQuery= mongooseQuery;
        this.queryObj= queryObj;
    }
    filter() {
        //1) execlude these words sort, fields, keyword, page, limit from the qeryObj
        const execluded_queries= ['sort', 'fields', 'keyword', 'page', 'limit'];
        let queryObj= {...this.queryObj};
        execluded_queries.forEach(val=>delete queryObj[val]);

        //2) add $ before each of these words gte , gt , lte , lt 
        queryObj= JSON.stringify(queryObj);
        queryObj= queryObj.replace(/\b(gte|gt|lt|lte)\b/g, (match)=> `$${match}`);
        
        this.mongooseQuery= this.mongooseQuery.find(JSON.parse(queryObj));
        return this;
    }

    
}

module.exports= ApiFeatures;