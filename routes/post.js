import { Router } from "express";
import { addPost, getPost, getPostByUsername } from "../controllers/post.js";
import multer from "multer";
import { checkLoginStatus } from "../middleware/auth.js";
import {
  checkLike,
  likePost,
  addComment,
  getPostById,
  getComments,
  deleteComment,
  deletePost,
  updateComment,
  updatePost,
  getPostByPostId
} from "../controllers/post.js";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router
  .route("/addpost")
  .post(checkLoginStatus, upload.single("image"), addPost);
router.route("/getpost").get(checkLoginStatus, getPost);
router.route("/getpost/:username").get(checkLoginStatus, getPostByUsername);
router.route("/getpostById/:id").get(checkLoginStatus, getPostById);
router.route("/checklike").post(checkLike);
router.route("/like").put(likePost);
router.route("/addcomments").post(addComment);
router.route("/getcomments/:id").get(getComments);
router.route("/deleteComment").delete(deleteComment);
router.route("/deletePost").delete(deletePost);
router.route("/updateComment").put(updateComment);
router.route("/updatePost").put(updatePost);
router.route("/getPostByPostId/:id").get(getPostByPostId);
export default router;
