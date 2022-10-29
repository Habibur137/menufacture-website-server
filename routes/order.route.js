const {
  getAllOrder,
  placeOrder,
  getSingleOrder,
  deleteOrder,
  getOrderByEmail,
} = require("../controllers/order.controller");
const { verifyJWT } = require("../middleware/verifyToken");
const router = require("express").Router();

router.route("/").get(verifyJWT, getAllOrder).post(verifyJWT, placeOrder);

router
  .route("/:id")
  .get(verifyJWT, getSingleOrder)
  .post(verifyJWT, deleteOrder);

router.route("/:email").get(verifyJWT, getOrderByEmail);

module.exports = router;
