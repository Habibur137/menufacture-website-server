const { getDb, ObjectId } = require("../db/connectDB");

module.exports.getAllProduct = async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection("products").find({}).toArray();
    // res.status(200).json({
    //   status: true,
    //   products,
    // });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.addProduct = async (req, res) => {
  try {
    const db = getDb();
    const product = req.body;
    const addedProducts = await db.collection("products").insertOne(product);
    res.status(200).send(addedProducts);
    // res.status(200).json({
    //   status: true,
    //   addedProducts,
    // });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.deleteProduct = async (req, res) => {
  try {
    const db = getDb();
    const deleteId = req.params.id;
    const filter = { _id: ObjectId(deleteId) };
    const result = await db.collection("products").deleteOne(filter);
    res.status(200).send(result);
    // res.status(200).json({
    //   status: true,
    //   result,
    // });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.getSingleProduct = async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;
    console.log(productId);
    const searchId = { _id: ObjectId(productId) };
    const result = await db.collection("products").findOne(searchId);
    res.status(200).send(result);
    // res.status(200).json({
    //   status: true,
    //   result,
    // });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};

module.exports.updateSingleProduct = async (req, res) => {
  try {
    const db = getDb();
    const id = req.params.id;
    const updatedProduct = req.body;
    console.log(updatedProduct);
    console.log(id);
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: updatedProduct,
    };
    const products = await db
      .collection("products")
      .updateOne(filter, updateDoc, options);

    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Product does not uodate",
    });
  }
};
