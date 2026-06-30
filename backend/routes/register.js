import express from "express";
import registerProject from "../controllers/register.js";
import upload from "../middlewares/upload.js";
import validateProject from "../middlewares/validate.js";

const router = express.Router();

router.post("/", upload.single("logo"), validateProject, registerProject);

export default router;
