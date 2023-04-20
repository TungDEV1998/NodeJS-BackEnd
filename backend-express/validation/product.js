const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

const validateSchema = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

const getProductsSchema = yup.object({
  query: yup.object({
    categoryId: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
    supplierId: yup
      .string()
      .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
        if (!value) return true;
        return ObjectId.isValid(value);
      }),
    productName: yup.string(),
    fromPrice: yup.string(),
    toPrice: yup.string(),
    fromDiscount: yup.string(),
    toDiscount: yup.string(),
    fromStock: yup.string(),
    toStock: yup.string(),
    skip: yup.string(),
    limit: yup.string(),
  }),
});

module.exports = { validateSchema, getProductsSchema };
