import express from "express";
import { sendMessage, getMessages, getThreads, } from "../controllers/support.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = express.Router();

router.post( "/:threadId/messages", authMiddleware, sendMessage );
router.get(  "/:threadId/messages", authMiddleware, getMessages );
router.get( "/threads", authMiddleware,getThreads );

export default router;