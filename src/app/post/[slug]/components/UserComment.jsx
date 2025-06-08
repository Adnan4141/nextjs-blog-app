"use client";
import React, { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import EditComment from "./EditComment";
import { likedCommentAction } from "@/app/actions/LikedCommentAction";
import { deleteCommentAction } from "@/app/actions/DeleteCommentAction";
import { toast } from "sonner";

const UserComment = ({ comment, comments, setComments, session }) => {
  const [editText, setEditText] = useState("");
  const [isEdited, setIsEdited] = useState(null);

  const handleLikedComment = async (commentId) => {
    const res = await likedCommentAction(commentId, session?.user._id);
    if (res.success) {
      const updateComments = comments.map((comment) =>
        comment._id == commentId
          ? {
              ...comment,
              numberOfLikes: res.data.numberOfLikes,
              likes: res.data.likes,
            }
          : comment
      );
      setComments(updateComments);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteCommentAction(commentId);
      if (res?.success) {
        toast.success(res.message);
        const currentComments = comments.filter(
          (item) => item._id !== commentId
        );
        setComments(currentComments);
      } else return toast.error(res?.message);
    } catch (error) {
      console.log(error.message || error);
    }
  };

  return (
    <>
      {isEdited === comment._id ? (
        <EditComment
          setIsEdited={setIsEdited}
          comments={comments}
          comment={comment}
          setComments={setComments}
        />
      ) : (
        <>
          <p className="text-sm pl-2 text-gray-600 dark:text-gray-400">
            {comment?.content}
          </p>

          <hr className="text-gray-800 my-3 w-2/3 pl-4" />
          <div className="flex py-1 gap-4 ">
           { !session.user &&
            <span className={`cursor-pointer text-lg hover:text-blue-600`}>
              <button
                type="button"
                className={`${
                  comment.likes.includes(session?.user._id)
                    ? "text-blue-800"
                    : ""
                } cursor-pointer`}
                onClick={(e) => handleLikedComment(comment?._id)}
              >
                <AiFillLike />
              </button>
            </span>

           }
            <span className="text-sm text-gray-400  cursor-pointer ">
              {comment?.numberOfLikes} Liked
            </span>
            {session && session?.user._id===comment?.user?._id && (
              <>
                <span className="text-sm  text-gray-500 cursor-pointer hover:text-blue-600">
                  <button
                    className="cursor-pointer"
                    onClick={() => setIsEdited(comment._id)}
                  >
                    Edit
                  </button>
                </span>
                <span className="text-sm text-gray-500 cursor-pointer hover:text-blue-600">
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="cursor-pointer"
                  >
                    Delete
                  </button>
                </span>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserComment;
