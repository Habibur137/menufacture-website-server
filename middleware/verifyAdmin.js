const { getDb } = require("../db/connectDB");
const verifyAdmin = async (req, res, next) => {
  const db = getDb();
  const requester = req.decoded?.email;
  const requesterAccount = await db.collection("users").findOne({
    email: requester,
  });
  if (requesterAccount.role === "admin") {
    next();
  } else {
    return res.status(403).send({ message: "forbiden access" });
  }
};

module.exports = verifyAdmin;
