import express from "express";
const router = express.Router();
const controller = require("./controller/index");

router.post("/", controller.loginController);

module.exports = router;
