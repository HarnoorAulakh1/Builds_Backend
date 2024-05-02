import { post } from "../schema/post.js";
import { profile } from "../schema/profile.model.js";
import { comment } from "../schema/comments.js";
import notification from "../schema/notification.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const addPost = async (req, res) => {
  var data = req.body;
  console.log(data);
  var local = req.file["path"];
  const result = await uploadToCloudinary(local);
  // console.log(result);
  // console.log({...data,image:result.url});

  const Post = new post({ ...data, image: result.url });
  post
    .insertMany(Post)
    .then(() => {
      //console.log("Post Added 1", data);
      profile
        .updateOne({ username: data.username }, { $push: { posts: Post._id } })
        .then(() => {
          res.send("Post Added");
        })
        .catch((err) => {
          res.send(err.message);
        });
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const getPost = async (req, res) => {
  //console.log("hello "+req.cookies.accessToken);
  const { pageLimit, n } = req.query;
  await post
    .find()
    .sort({ createdAt: -1 })
    .limit(pageLimit)
    .skip(n * pageLimit)
    .then((response) => {
      //res.setHeader("Access-Control-Allow-Origin", "hello where you going");
      res.send({ posts: response, user: req.user });
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const getPostByUsername = async (req, res) => {
  await post
    .find({ username: req.params.username })
    .then((response) => {
      res.send({ posts: response, user: req.user });
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const checkLike = async (req, res) => {
  var data = req.body;
  await post
    .find({ _id: data.post_id, likes: data.user_id })
    .then((response) => {
      if (response.length == 1) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const addComment = async (req, res) => {
  var data = req.body;
  const Comment = new comment(data);
  //console.log(data);
  await notification.insertMany({
    user_id: data.sendto,
    type: "comment",
    profile_link: data.user_id,
    profile_username: data.username,
    content: `${data.username} commented on your post`,
    photo: data.photo,
  });
  await comment.insertMany(Comment);
  await post
    .updateOne({ _id: data.post_id }, { $push: { comments: Comment._id } })
    .then((response) => {
      res.send(Comment);
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const getComments = async (req, res) => {
  await comment
    .find({ post_id: req.params.id })
    .sort({ createdAt: -1 })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const likePost = async (req, res) => {
  var data = req.body;
  await profile.find({ username: data.username }).then(async (response) => {
    if (data.inc == "1") {
      await notification.insertMany({
        user_id: data.post.user_id,
        type: "post",
        profile_link: response[0]["_doc"]["_id"],
        profile_username: data.username,
        content: `${data.username} liked your post`,
        photo: response[0]["_doc"]["photo"],
      });
      await post
        .updateOne(
          { _id: data.id },
          { $push: { likes: response[0]["_doc"]["_id"] } }
        )
        .then(() => {
          res.send("Liked");
        })
        .catch((err) => {
          res.send(err.message);
        });
    } else {
      await post
        .updateOne(
          { _id: data.id },
          { $pull: { likes: response[0]["_doc"]["_id"] } }
        )
        .then(() => {
          res.send("Disliked");
        })
        .catch((err) => {
          res.send(err.message);
        });
    }
  });
};

export const deleteComment = async (req, res) => {
  var data = req.body;
  console.log(data);
  await post.updateOne(
    { _id: data.post_id },
    { $pull: { comments: data._id } }
  );
  await comment
    .deleteOne({ _id: data._id })
    .then((response) => {
      console.log("deleted" + response);
      res.send("Deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const updateComment = async (req, res) => {
  var data = req.body;
  console.log(data);
  await comment
    .updateOne({ _id: data._id }, { comment: data.comment })
    .then(() => {
      res.send("Updated");
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const deletePost = async (req, res) => {
  var data = req.body;
  await deleteFromCloudinary(data.image);
  await profile.updateOne(
    { username: data.username },
    { $pull: { posts: data._id } }
  );
  await post
    .deleteOne({ _id: data._id })
    .then(() => {
      res.send("Deleted");
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const updatePost = async (req, res) => {
  var data = req.body;
  await post
    .updateOne({ _id: data._id }, { caption: data.caption })
    .then(() => {
      res.send("Updated");
    })
    .catch((err) => {
      res.send(err.message);
    });
};
export const getPostById = async (req, res) => {
  const data = req.params.id;
  //console.log(data);
  await post
    .find({ user_id: data })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err.message);
    });
};

export const getPostByPostId = async (req, res) => {
  const data = req.params.id;
  console.log(data + "hello");
  await post
    .findOne({ _id: data })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err.message);
    });
};
