// // app/api/posts/route.ts
// import { PostModel } from "@/models/Post";
// import { NextRequest, NextResponse } from "next/server";
// import { connectdb } from "@/libs/db";
// import { isValidObjectId } from "mongoose";

// // GET /api/posts
// export async function GET(req: NextRequest) {
//   await connectdb();
//   // ... fetch posts
//   return NextResponse.json({ posts }, { status: 200 });
// }

// // POST /api/posts
// export async function POST(req: NextRequest) {
//   await connectdb();
//   const body = await req.json();
//   // ... create post
//   return NextResponse.json({ post }, { status: 201 });
// }

// /* 

// import express from "express";
// import { authGuard } from "../../middlewares/index.mjs";
// import { multerMiddleware, handleMulterError } from "../../libs/multer.mjs";
// import { uploadOnCloudinary } from "../../libs/cloudinary.mjs";

// const router = express.Router();

// // Create Post
// router.post(
//   "/post",
//   authGuard,
//   handleMulterError("postImage"),
//   async (req, res) => {
//     try {
//       const { title, description } = req.body;

//       if (!title?.trim()) {
//         return res.status(400).send({
//           error: "Title is Required",
//         });
//       }

//       if (!description?.trim()) {
//         return res.status(400).send({
//           error: "Description is Required",
//         });
//       }

//       let postImage = null;

//       // Image is optional
//       if (req.file) {
//         if (!req.file.mimetype.startsWith("image/")) {
//           return res.status(400).send({
//             message: "Only images are allowed",
//           });
//         }

//         const result = await uploadOnCloudinary(req.file, "posts");

//         postImage = result.secure_url;
//       }

//       const post = await PostModel.create({
//         title: title.trim(),
//         description: description.trim(),
//         postImage,
//         userId: req.current_user._id,
//       });

//       return res.status(201).send({
//         message: "Post Created",
//         data: post,
//       });
//     } catch (error) {
//       console.error(error);

//       return res.status(500).send({
//         error: "Internal Server Error",
//       });
//     }
//   },
// );

// // Get All Posts
// router.get("/post", async (req, res) => {
//   try {
//     const allPosts = await PostModel.find()
//       .populate("userId")
//       .sort({ createdAt: -1 });

//     return res.send({
//       message: "Posts Found",
//       data: allPosts,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).send({
//       error: "Internal Server Error",
//     });
//   }
// });

// // Get Single Post
// router.get("/post/:postId", async (req, res) => {
//   try {
//     const postId = req.params.postId;

//     if (!isValidObjectId(postId)) {
//       return res.status(400).send({
//         error: "Invalid Id",
//       });
//     }

//     const singlePost = await PostModel.findById(postId).populate("userId");

//     if (!singlePost) {
//       return res.status(404).send({
//         message: "Post Not Found",
//       });
//     }

//     return res.send({
//       message: "Post Found",
//       data: singlePost,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).send({
//       error: "Internal Server Error",
//     });
//   }
// });

// // Delete Post
// router.delete("/post/:postId", authGuard, async (req, res) => {
//   try {
//     const postId = req.params.postId;

//     if (!isValidObjectId(postId)) {
//       return res.status(400).send({
//         error: "Invalid Id",
//       });
//     }

//     const post = await PostModel.findById(postId);

//     if (!post) {
//       return res.status(404).send({
//         message: "Post Not Found",
//       });
//     }

//     if (req.current_user._id.toString() !== post.userId.toString()) {
//       return res.status(403).send({
//         error: "You are not authorized to delete this post",
//       });
//     }

//     await PostModel.findByIdAndDelete(postId);

//     return res.send({
//       message: "Post Deleted",
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).send({
//       error: "Internal Server Error",
//     });
//   }
// });

// // Update Post
// router.put("/post/:postId", authGuard, async (req, res) => {
//   try {
//     const postId = req.params.postId;

//     if (!isValidObjectId(postId)) {
//       return res.status(400).send({
//         error: "Invalid Id",
//       });
//     }

//     const post = await PostModel.findById(postId);

//     if (!post) {
//       return res.status(404).send({
//         message: "Post Not Found",
//       });
//     }

//     if (req.current_user._id.toString() !== post.userId.toString()) {
//       return res.status(403).send({
//         error: "You are not authorized to update this post",
//       });
//     }

//     const { title, description } = req.body;

//     if (!title?.trim()) {
//       return res.status(400).send({
//         error: "Title is Required",
//       });
//     }

//     if (!description?.trim()) {
//       return res.status(400).send({
//         error: "Description is Required",
//       });
//     }

//     const updatedPost = await PostModel.findByIdAndUpdate(
//       postId,
//       {
//         $set: {
//           title: title.trim(),
//           description: description.trim(),
//         },
//       },
//       {
//         new: true,
//       },
//     );

//     return res.send({
//       message: "Post Updated",
//       data: updatedPost,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).send({
//       error: "Internal Server Error",
//     });
//   }
// });

// export default router;
// */