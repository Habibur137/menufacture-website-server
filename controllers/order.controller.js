const { getDb, ObjectId } = require("../db/connectDB");

module.exports.getAllOrder = async (req, res) => {
  try {
    const db = getDb();
    const orders = await db.collection("orders").find({}).toArray();
    // res.status(200).json({
    //   status: true,
    //   products,
    // });
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.getSingleOrder = async (req, res) => {
  try {
    const db = getDb();
    const orderId = req.params.orderId;
    const searchById = { _id: ObjectId(orderId) };
    const result = await db.collection("orders").findOne(searchById);
    // res.status(200).json({
    //   status: true,
    //   products,
    // });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};

module.exports.placeOrder = async (req, res) => {
  try {
    const db = getDb();
    const orderInfo = req.body;
    const result = await db.collection("orders").insertOne(orderInfo);
    res.status(200).send(result);
    // res.status(200).json({
    //   status: true,
    //   addedProducts,
    // });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "order not placed",
    });
  }
};
module.exports.deleteOrder = async (req, res) => {
  try {
    const db = getDb();
    const deleteId = req.params.id;
    const filter = { _id: ObjectId(deleteId) };
    const result = await db.collection("orders").deleteOne(filter);
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
module.exports.getOrderByEmail = async (req, res) => {
  try {
    const db = getDb();
    const decodedEmail = req.decoded.email;
    const buyerEmail = req.params.email;
    if (decodedEmail === buyerEmail) {
      const result = await db
        .collection("orders")
        .find({ buyerEmail })
        .toArray();
      res.send(result);
    } else {
      return res.status(403).send({ message: "forbiden access" });
    }
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
