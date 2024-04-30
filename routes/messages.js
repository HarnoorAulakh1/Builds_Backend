import { Router } from "express";

import { checkLoginStatus } from "../middleware/auth.js";
import { deleteMessage ,getMessage,getMessageLatest,sendMessage} from "../controllers/messages.js";

const router = Router();

router.route("/sendmessage").post(checkLoginStatus, sendMessage);
router.route("/getmessage").get(checkLoginStatus, getMessage);
router.route("/getmessageLatest").get(checkLoginStatus, getMessageLatest);
router.route("/deletemessage").delete(checkLoginStatus, deleteMessage);


export default router;