"use server"

import { dbConnect } from "@/lib/dbConfig"
import CommentModel from "@/models/CommentModel"


export const editCommentAction = async(text,commentId)=>{
   try {
      await dbConnect()
      const comment = await CommentModel.findById(commentId)
      
       if(!comment) return {success:false, message:"Comment not found"}

      if(text){
         comment.content = text;
      }
      await comment.save();

      return {success:true,message:"Updated comment successfully"}
      

   } catch (error) {
      return {success:false,message:error.message || error}
      
   }
       
}