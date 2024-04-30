import express from "express";
import {
  checklogin,
  getUser,
  login,
  logout,
  register,
  getNotifications,
  acceptFriendRequest,
  deleteNotification,
  addFriendRequest,
  getFriends,
  getUserById,
} from "../controllers/user.js";
import { Router } from "express";
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const router = Router();
const upload = multer({ storage: storage });

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/register").post(upload.single("photo"),register);
router.route("/getUser/:id").get(getUser);
router.route("/checklogin").get(checklogin);
router.route("/getNotification").get(getNotifications);
router.route("/acceptFriendRequest").post(acceptFriendRequest);
router.route("/addFriendRequest").post(addFriendRequest);
router.route("/deleteNotification").delete(deleteNotification);
router.route("/getFriends").get(getFriends);
router.route("/getUserById/:id").get(getUserById);
export default router;
