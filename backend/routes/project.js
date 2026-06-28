import express from "express";
import registerProject from "../controllers/project.js";
import upload from "../middlewares/upload.js";
import validateProject from "../middlewares/validate.js";

const router = express.Router();

router.post("/register", upload.single("logo"), validateProject, registerProject);

export default router;