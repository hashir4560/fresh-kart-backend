const express = require("express");
const controllers = require("../controllers/user");
const router = express.Router();

router.route("/").get(controllers.getUsers);
router.route("/:id").get(controllers.getUserbyId);
router.route("/register").post(controllers.RegisterUser);
router.route("/login").post(controllers.userLogin);
router.route("/update-password").put(controllers.updateUserPassword);

router.route("/:id").delete(controllers.deleteUserById);

module.exports = router;
