import express from "express";
import controller from "./controller/index";
const router = express.Router();

router.post("/", controller.login);

export default router;
