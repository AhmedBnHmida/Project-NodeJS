const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");


router.post("/add", userController.add);
router.get("/getall", userController.getall);
router.get("/getbyid/:id", userController.getbyid);
router.put("/update/:id", userController.update);
router.delete("/remove/:id", userController.remove);


router.get("/chat", (req, res, next) => {
  res.render("chat");
});

router.get("/user", (req, res, next) => {
  res.render("user");
});

module.exports = router;
