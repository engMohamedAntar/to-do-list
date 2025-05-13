const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const docsCount= await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .fieldFilter()
    .search()
    .paginate(docsCount);
    const { mongooseQuery, paginationInfo } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({ status: "success", paginationInfo, data: documents });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) return next(new ApiError("Document not found", 404));

    res.status(201).json({ status: "success", data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ status: "success", data: newDoc });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: "success", data: updatedDoc });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const user = await Model.findByIdAndDelete(req.params.id);
    if (!user) return new ApiError("no document found", 204);
    res.status(204).send();
  });
