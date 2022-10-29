const { getDb } = require("../db/connectDB");
const jwt = require("jsonwebtoken");
module.exports.getAllUser = async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection("users").find({}).toArray();
    // res.status(200).json({
    //   status: true,
    //   products,
    // });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const db = getDb();
    const email = req.params.email;
    console.log(email);
    const updatedInfo = req.body;
    const filter = { email };
    const options = { upsert: true };
    const updateDoc = {
      $set: updatedInfo,
    };
    const result = await db
      .collection("profiles")
      .updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};

module.exports.placeUser = async (req, res) => {
  try {
    const db = getDb();
    const email = req.params.email;
    const user = req.body;
    const filter = { email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await db
      .collection("users")
      .updateOne(filter, updateDoc, options);
    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
      expiresIn: "1d",
    });
    res.send({ result, token });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};

module.exports.updateUserForAdmin = async (req, res) => {
  try {
    const db = getDb();
    const email = req.params.email;
    const filter = { email };
    const updateDoc = {
      $set: { role: "admin" },
    };
    const result = await db.collection("users").updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.userAdminChecked = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await db.collection("users").findOne({ email });
    const isAdmin = user?.role === "admin";
    res.send({ admin: isAdmin });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
module.exports.getUserProfile = async (req, res) => {
  try {
    const db = getDb();
    const email = req.params.email;
    const profile = await db.collection("profiles").findOne({ email });
    res.send(profile);
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Something went wrong",
    });
  }
};
