const { getDb } = require("../db/connectDB");
module.exports.getAllReviews = async (req, res) => {
  try {
    const db = getDb();
    const reviews = await db.collection("reviews").find({}).toArray();
    // res.status(200).json({
    //   status: true,
    //   products,
    // });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.placeReview = async (req, res) => {
  try {
    const db = getDb();
    const reviewInfo = req.body;
    const result = await db.collection("reviews").insertOne(reviewInfo);
    res.send(result);
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
