const {
  getAllProduct,
  addProduct,
  getSingleProduct,
  deleteProduct,
  updateSingleProduct,
} = require("../controllers/product.controllers");
const { verifyJWT } = require("../middleware/verifyToken");
const router = require("express").Router();

router.route("/").get(getAllProduct).post(verifyJWT, addProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .post(verifyJWT, deleteProduct)
  .put(verifyJWT, updateSingleProduct);

module.exports = router;
