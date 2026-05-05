import { Router } from "express";
import upload from "../middleware/upload.js";
import { transcribe } from "../controllers/transcribe.controller.js";

const router = Router();

router.post("/transcribe", upload.single("audio"), transcribe);

export default router;
