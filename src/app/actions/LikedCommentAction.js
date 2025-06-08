"use server";

import CommentModel from "@/models/CommentModel";

const { dbConnect } = require("@/lib/dbConfig");

export const likedCommentAction = async (commentId, userId) => {
  try {
    await dbConnect();

    const comment = await CommentModel.findById(commentId);

    if(!comment)
      return {
        success: false,
        message: "Comment not found",
      };
    
      const userIndex = comment.likes.indexOf(userId);

      if(userIndex==-1){
         comment.likes.push(userId)
         comment.numberOfLikes++;
      }else{
         comment.likes.splice(userIndex,1)
          comment.numberOfLikes--;
      }

     

   const savedComment =  await comment.save();

 
    return {
      success: true,
      message: "Successfully liked/unlike the comment",
      data:JSON.parse(JSON.stringify(savedComment))
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || error || "Internal Server Error",
    };
  }
};
