"use server";

import { dbConnect } from "@/lib/dbConfig";
import CommentModel from "@/models/CommentModel";


export async function deleteCommentAction(commentId) {
  
   try {
    await dbConnect();

     const deleteComment = await CommentModel.findByIdAndDelete(commentId)
   
     if(!deleteComment)return { success: false, message:"Comment was not found"};
    return { success: true, message: "Comment deleted successfully" };
  } catch (error) {
    console.log("Server action failed", error.message);
    return { success: false, message: error.message || error };
  }
}
