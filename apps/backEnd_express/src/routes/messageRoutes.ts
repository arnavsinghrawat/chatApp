import express from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages, getSideContainerImageMessages, getUserForSideBar, markMessageAsSeen, sendMessage } from "../controllers/messageController";


const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSideBar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);
messageRouter.get("/imagesSideContaner/:id", protectRoute, getSideContainerImageMessages);

export default messageRouter;