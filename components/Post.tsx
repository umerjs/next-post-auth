"use client";

import Form from "../components/Form";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../app/globals.css";
import { BackendUrl } from "@/utils/core";
import Navbar from "../components/Navbar";
import { store } from "../store/states";

interface Post {
  _id: string;
  title: string;
  description: string;
  postImage?: string | null;
  userId: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    profileimg?: string | null;
  };
}

const Post = () => {
  const { user } = store();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getallposts();
  }, []);

  const getallposts = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/v1/post/`, {
        headers: {
          authorizedtoken: localStorage.getItem("token"),
        },
      });

      const postsData = response.data?.data ?? [];

      setPosts(postsData);

      console.log("Fetched posts:", postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const delete_post = async (id: string) => {
    if (!id) {
      alert("Post id is required");
      return;
    }

    try {
      await axios.delete(`${BackendUrl}/api/v1/post/${id}`, {
        headers: {
          authorizedtoken: localStorage.getItem("token"),
        },
      });

      alert("Post deleted successfully");

      getallposts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const update_post = async (
    id: string,
    title: string,
    description: string,
  ) => {
    if (!id) {
      alert("Post id is required");
      return;
    }

    const updatedTitle = prompt("Enter New Title", title);
    const updatedDescription = prompt("Enter New Description", description);

    if (updatedTitle === null || updatedDescription === null) {
      return;
    }

    if (!updatedTitle.trim() || !updatedDescription.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      await axios.put(
        `${BackendUrl}/api/v1/post/${id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
        },
        {
          headers: {
            authorizedtoken: localStorage.getItem("token"),
          },
        },
      );

      alert("Post updated successfully");

      getallposts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="mx-auto max-w-5xl px-4">
          {/* Heading */}
          <h1 className="mb-8 text-center text-4xl font-bold text-indigo-600">
            All Posts
          </h1>

          {/* Create Post Form */}
          <Form getallposts={getallposts} />

          {/* Posts */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {posts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No posts found.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="rounded-xl bg-white p-6 shadow-lg transition hover:shadow-xl"
                >
                  {/* User Profile */}
                  <div className="mb-5">
                    <Link
                      href={`/profile/${post.userId._id}`}
                      className="flex items-center gap-3"
                    >
                      {/* Profile Image */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                        {post.userId.profileimg ? (
                          <img
                            src={post.userId.profileimg}
                            alt={`${post.userId.firstname} ${post.userId.lastname}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>
                            {post.userId.firstname?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                        )}
                      </div>

                      {/* User Information */}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {post.userId.firstname} {post.userId.lastname}
                        </p>

                        <p className="text-sm text-gray-500">
                          @{post.userId.username}
                        </p>
                      </div>
                    </Link>
                  </div>
                  {post.postImage && (
                    <div className="mb-4 w-full overflow-hidden rounded-lg aspect-video">
                      <img
                        src={post.postImage}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-800">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {post.description}
                  </p>
                  {/* Action Buttons */}
                  {user?._id === post.userId._id && (
                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          update_post(post._id, post.title, post.description)
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        onClick={() => delete_post(post._id)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
