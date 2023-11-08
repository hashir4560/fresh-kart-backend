const express = require("express");
const controllers = require("../controllers/freshkart");
const router = express.Router();

router.route("/products").get(controllers.getAllItems);
router.route("/products/:id").get(controllers.getItemById);
router.route("/products/:type/:popular").get(controllers.getAllPopularItems); // Define this route first
router.route("/products/:type").get(controllers.getItemByType);
router.route("/products/new").post(controllers.addNewProducts);
router.route("/products/:id").delete(controllers.deleteProductById);

module.exports = router;
// router.route("/register").post(controllers.newLogin);
// router.route("/login").post(controllers.login);
