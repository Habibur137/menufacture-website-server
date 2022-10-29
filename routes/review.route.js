const {
  getAllReviews,
  placeReview,
} = require("../controllers/review.controller");
const { verifyJWT } = require("../middleware/verifyToken");
const router = require("express").Router();

router.route("/").get(verifyJWT, getAllReviews).post(verifyJWT, placeReview);

module.exports = router;
