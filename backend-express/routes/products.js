const express = require("express");
const router = express.Router();
const yup = require("yup");
const { Product } = require("../models");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const ObjectId = require("mongodb").ObjectId;
const { validateSchema, getProductsSchema } = require("../validation/product");
// let data = [
//     {id: 1, name: 'iphone 14 ProMax', price: 1500},
//     {id: 2, name: 'iphone 13 ProMax', price: 1200},
//     {id: 3, name: 'iphone 12 ProMax', price: 1000},
//     {id: 4, name: 'iphone 11 ProMax', price: 800},
//     {id: 5, name: 'iphone X', price: 500},
// ];

// Methods: POST / PATCH / GET / DELETE / PUT
/* GET home page. */

// Get all on nultiple conditions
router.get("/", validateSchema(getProductsSchema), async (req, res, next) => {
  try {
    const {
      categoryId,
      supplierId,
      productName,
      fromPrice,
      toPrice,
      fromDiscount,
      toDiscount,
      fromStock,
      toStock,
      skip,
      limit,
    } = req.query;

    const query = {
      $expr: {
        $and: [
          categoryId && { $eq: ["$categoryId", categoryId] },
          supplierId && { $eq: ["$supplierId", supplierId] },
          fromPrice && { $gte: ["$price", Number(fromPrice)] },
          toPrice && { $lte: ["$price", Number(toPrice)] },
          productName && {
            $regexMatch: { input: "$name", regex: productName, options: "i" },
          },
          fromStock && { $gte: ["$stock", Number(fromStock)] },
          toStock && { $lte: ["$stock", Number(toStock)] },
          fromDiscount && { $gte: ["$discount", Number(fromDiscount)] },
          toDiscount && { $lte: ["$discount", Number(toDiscount)] },
        ].filter(Boolean),
      },
    };
    let results = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true })
      .skip(skip)
      .limit(limit);
    // .limit(10);

    res.json(results);
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

//test

// Get condition

//Get data depend on Category

router.get("/searchOnCategory", async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};

    let found = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });

    res.status(200).json(found);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//Get data depend on Supplier

router.get("/searchOnSupplier", async (req, res, next) => {
  try {
    const { supplierId } = req.query;
    const query = supplierId ? { supplierId } : {};

    let found = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });

    res.status(200).json(found);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Get data depend on From, To Price

router.get("/searchOnPrice", async (req, res, next) => {
  try {
    let { kind, fromPrice, toPrice } = req.query;
    const fromCondition = parseInt(fromPrice);
    const toCondition = parseInt(toPrice);
    let query = {};

    if (fromCondition && toCondition) {
      query = {
        $expr: {
          $and: [
            { $gte: ["$price", fromCondition] },
            { $lte: ["$price", toCondition] },
          ],
        },
      };
    } else if (toCondition) {
      query = {
        $expr: {
          $lte: ["$price", toCondition],
        },
      };
    } else if (fromCondition) {
      query = {
        $expr: {
          $gte: ["$price", fromCondition],
        },
      };
    }
    console.log("««««« query »»»»»", query);
    let found = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });

    res.status(200).json(found);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Get data depend on From, To Discount

router.get("/searchOnDiscount", async (req, res, next) => {
  try {
    let { kind, fromDiscount, toDiscount } = req.query;
    const fromCondition = parseInt(fromDiscount);
    const toCondition = parseInt(toDiscount);
    let query = {};

    if (fromCondition && toCondition) {
      query = {
        $expr: {
          $and: [
            { $gte: ["$discount", fromCondition] },
            { $lte: ["$discount", toCondition] },
          ],
        },
      };
    } else if (toCondition) {
      query = {
        $expr: {
          $lte: ["$discount", toCondition],
        },
      };
    } else if (fromCondition) {
      query = {
        $expr: {
          $gte: ["$discount", fromCondition],
        },
      };
    }

    let found = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });

    res.status(200).json(found);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Get data depend on From, To Stock

router.get("/searchOnStock", async (req, res, next) => {
  try {
    let { kind, fromStock, toStock } = req.query;
    const fromCondition = parseInt(fromStock);
    const toCondition = parseInt(toStock);
    let query = {};

    if (fromCondition && toCondition) {
      query = {
        $expr: {
          $and: [
            { $gte: ["$stock", fromCondition] },
            { $lte: ["$stock", toCondition] },
          ],
        },
      };
    } else if (toCondition) {
      query = {
        $expr: {
          $lte: ["$stock", toCondition],
        },
      };
    } else if (fromCondition) {
      query = {
        $expr: {
          $gte: ["$stock", fromCondition],
        },
      };
    }

    let found = await Product.find(query)
      .populate("category")
      .populate("supplier")
      .lean({ virtuals: true });

    res.status(200).json(found);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Get a data
router.get("/:id", async (req, res, next) => {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test(
          "Validate ObjectId",
          "${path} is not a valid ObjectId",
          (value) => {
            return ObjectId.isValid(value);
          }
        ),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const itemId = req.params.id;
      let found = await Product.findById(itemId)
        .populate("category")
        .populate("supplier")
        .lean({ virtuals: true });
      if (found) {
        return res.status(200).json(found);
      }
      return res.status(500).send({ oke: false, message: "Object not found" });
    })
    .catch((err) => {
      return res.status(500).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "Yup",
      });
    });
});
router.post("/", async (req, res, next) => {
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required().max(50),
      price: yup.number().required().positive(),
      discount: yup.number().required().positive().min(0).max(75),
      stock: yup.number().required().positive().integer(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      try {
        const newItem = req.body;
        let data = new Product(newItem);
        let result = data.save();
        return res.status(200).json({
          oke: true,
          message: "Created successfully!",
          result: result,
        });
      } catch (error) {
        res.status(500).json({ error: error });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provier: "Yup",
      });
    });
});

// Delete data
router.delete("/:id", async (req, res, next) => {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test(
          "Validate ObjectId",
          "${path} is not a valid ObjectId",
          (value) => {
            return ObjectId.isValid(value);
          }
        ),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const itemId = req.params.id;
      let found = await Product.findByIdAndDelete(itemId);
      if (found) {
        return res.status(200).json({ oke: true, result: found });
      }
      return res.status(500).send({ oke: false, message: "Object not found" });
    })
    .catch((err) => {
      return res.status(500).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "Yup",
      });
    });
});

//PATCH DATA
router.patch("/:id", function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test(
          "Validate ObjectId",
          "${path} is not a valid ObjectId",
          (value) => {
            return ObjectId.isValid(value);
          }
        ),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const itemId = req.params.id;
        const itemBody = req.body;

        if (itemId) {
          let update = await Product.findByIdAndUpdate(itemId, itemBody);
          res.status(200).send("Updated successfully");
        }
      } catch (error) {
        res.status(500).send(error);
      }
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "Yup",
      });
    });
});

module.exports = router;
