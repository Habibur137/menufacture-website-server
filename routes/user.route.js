const {
  getAllUser,
  placeUser,
  updateUserForAdmin,
  userAdminChecked,
  updateUserProfile,
  getUserProfile,
} = require("../controllers/user.controllers");
const verifyAdmin = require("../middleware/verifyAdmin");
const { verifyJWT } = require("../middleware/verifyToken");
const router = require("express").Router();

router.route("/").get(getAllUser);
router.put("/:email", verifyJWT, placeUser);
router
  .route("/admin/:email")
  .put(verifyJWT, updateUserForAdmin)
  .get(verifyJWT, verifyAdmin, userAdminChecked);

router
  .route("/profile/:email")
  .put(verifyJWT, updateUserProfile)
  .get(verifyJWT, getUserProfile);

module.exports = router;
