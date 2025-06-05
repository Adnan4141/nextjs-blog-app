import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
   content:{
      type:String,
      required:true,
   },
    post:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post",
      required:true
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"User"
    },
    likes:{
      type:[mongoose.Schema.Types.ObjectId],
       ref: "User",
      default:[]
    },
    numberOfLikes:{
      type:Number,
      default:0
    },
},{
   timestamps:true
}

)

const CommentModel =  mongoose.models.Comment || mongoose.model("Comment",commentSchema)
export default CommentModel;