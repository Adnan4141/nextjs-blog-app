"use server"

import CommentModel from "@/models/CommentModel";

const { dbConnect } = require("@/lib/dbConfig")


export const SubmitCommentAction =  async(data)=>{
    try {
      await dbConnect();
      const newComment = new CommentModel({
         ...data
      })

      let res = await newComment.save();

      res = await res.populate("user","image name")
      
      if(!res) return {
         success:false,
         message:"Failed to create the comment"
      }

      return {
         success:true,
         message:"Successfully create the comment",
         data:JSON.parse(JSON.stringify(res))
      }

    } catch (error) {
       return {
         success:false,
         message:error.message || error ||  "Internal Server Error"
      }
    }
}