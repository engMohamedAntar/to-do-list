class ApiFeatures {
  constructor(mongooseQuery, queryObj) {
    this.mongooseQuery = mongooseQuery;
    this.queryObj = queryObj;
  }
  filter() {
    //1) execlude these words sort, fields, keyword, page, limit from the qeryObj
    const execluded_queries = ["sort", "fields", "keyword", "page", "limit"];
    let queryObj = { ...this.queryObj };
    execluded_queries.forEach((val) => delete queryObj[val]);

    //2) add $ before each of these words gte , gt , lte , lt
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryObj));
    return this;
  }
  sort() {
    if (this.queryObj.sort) {
      const sortString = this.queryObj.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortString);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("createdAt");
    }
    return this;
  }
  fieldFilter() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  search() {
    const searchObj = {};
    if (this.queryObj.keyword) {
      searchObj.$or = [{ name: { $regex: this.queryObj.keyword, $options: 'i' } }]; //?
    }
    // console.log(searchObj);
    
    this.mongooseQuery= this.mongooseQuery.find(searchObj);
    return this;
  }

  paginate(docsCount) {
    const page= this.queryObj.page*1 || 1;
    const limit= this.queryObj.limit*1 || 10;
    const skip= (page-1) * limit;
    this.mongooseQuery= this.mongooseQuery.skip(skip).limit(limit);

    const prevPage= page>1 ? page-1: undefined;
    const nextPage= page*limit< docsCount ? page+1: undefined;

    const paginationInfo= {
      numberOfPages: Math.ceil(docsCount/limit),
      prevPage,
      currentPage: page,
      nextPage
    };
    this.paginationInfo= paginationInfo;
    return this;
  }
}

module.exports = ApiFeatures;


//notices
/*
this is how searccObj look like 
    const searchObj = {
      $or: [{ name: { $regex: "user", $options: "i" } }],
    };
*/