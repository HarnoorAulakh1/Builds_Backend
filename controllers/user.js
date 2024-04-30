import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { profile } from "../schema/profile.model.js";
import cookieParser from "cookie-parser";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import notification from "../schema/notification.js";
import { post } from "../schema/post.js";
import { set } from "mongoose";
import mongoose from "mongoose";

dotenv.config({ path: "./.env" });

export const logout = async (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.send("logged out");
};

export const login = async (req, res) => {
  var data = req.body;
  // console.log(data);
  const response = await profile.findOne({ username: data.username });
  if (response == null) {
    res.send("0");
  } else {
    const user = response;
    const valid = await response.isPasswordCorrect(data.password);
    if (valid) {
      const token = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          first: user.first,
          last: user.last,
          phno: user.phno,
          photo: user.photo,
          bio: user.bio,
          posts: user.posts,
        },
        process.env.Access_Token
      );
      res.cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      });
      const { password, ...rest } = user._doc;
      res.send(rest);
    } else {
      res.send("0");
    }
  }
};

export const register = async (req, res) => {
  var data = req.body;
  console.log(req.file);
  await profile.find({ username: data.username }).then(async (response) => {
    if (response.length == 0) {
      if (req.file == undefined) {
        await profile
          .insertMany({ ...data, photo:""})
          .then(() => {
            res.send("registered");
          })
          .catch((err) => {
            console.log(err.message);
            res.send(err.message);
          });
      } else {
        var local = req.file["path"];
        const result = await uploadToCloudinary(local);
        await profile
          .insertMany({ ...data, photo: result.url })
          .then(() => {
            res.send("registered");
          })
          .catch((err) => {
            console.log(err.message);
            res.send(err.message);
          });
      }
    } else {
      res.send("You have already registered");
    }
  });
};

export const getUser = async (req, res) => {
  const data = req.params.id;
  const result = await profile.find({
    username: { $regex: data, $options: "i" },
  });
  res.send(result);
};

export const getUserById = async (req, res) => {
  const data = req.params.id;
  const result = await profile.find({
    _id: data,
  });
  res.send(result);
};

export const checklogin = async (req, res) => {
  let token =
    req.cookies.accessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");
  if (token) {
    try {
      const valid = jwt.verify(token, process.env.Access_Token);
      if (!valid) res.send(false);
      res.send(true);
    } catch (error) {
      console.log(error.message);
      res.send(false);
    }
  } else {
    res.send(false);
  }
};

export const acceptFriendRequest = async (req, res) => {
  var data = req.body;
  const response = await profile.updateOne(
    { _id: data.user_id },
    { $push: { friends: data.friend_id } }
  );
  await profile.updateOne(
    { _id: data.friend_id },
    { $push: { friends: data.user_id } }
  );
  res.send(response);
};
export const getFriends = async (req, res) => {
  var data = req.query.id;
  try {
    const response = await profile.find({ _id: data });
    const response1= await profile.find({ _id: { $in: response[0].friends } });
    res.send(response1);
  } catch (err) {
    res.send("Error");
  }
};
export const removeFriend = async (req, res) => {
  var data = req.body;
  const response = await profile.updateOne(
    { username: data.username },
    { $pull: { friends: data.friend_id } }
  );
  res.send(response);
};
export const getNotifications = async (req, res) => {
  const data = req.query.id;
  try {
    const response = await notification.find({ user_id: data });
    res.send(response);
  } catch (err) {
    //console.log(err.message);
  }
};
export const deleteNotification = async (req, res) => {
  var data = req.body;
  console.log(data);
  const response = await notification
    .deleteOne({ _id: data.id })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err.message);
    });
};
export const addFriendRequest = async (req, res) => {
  var data = req.body;
  const friends=await profile.find({_id:data.user_id});
  console.log(friends);
  if(friends[0].friends.includes(data.profile_link)){
    res.send("Already Friends");
  }
  else{
  const response = await notification.insertMany(data);
  res.send(response);
  }
};
