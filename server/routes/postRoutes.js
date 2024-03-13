import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

router.post("/", async (req, res) => {
  console.log(req);
  try {
    const { name, prompt, photo } = req.body;
    console.log("Received post request:", name, prompt, photo);

    // const photoUrl = await cloudinary.uploader.upload(photo, {
    //   public_id: "unique_public_id",
    // });

    const newPost = await Post.create({
      name,
      prompt,
      photo,
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create post" });
  }
});

export default router;
