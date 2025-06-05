import { dbConnect } from "@/lib/dbConfig";
import { errorHandler } from "@/lib/ErrorHandler";
import CommentModel from "@/models/CommentModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import "@/models/PostModel";


export async function POST(req) {
  try {
    const { content, userId, postId } = await req.json();
     const session = await getServerSession(authOptions)
    
      await dbConnect()
    if (!content || !userId || !postId)
      return errorHandler(401,"Please provide required field")

    const newComment = new CommentModel({
      content,
      user: userId,
      post:postId
    });
   
     const res = await newComment.save();
     
     console.log(res)

    return NextResponse.json(
      {
        success: true,
        message: "Returned comments data",
        data:newComment,
      },
      {
        status: 200,
      }
    );


  } catch (error) {
    console.log(error.message);
    return errorHandler(500,error.message ||error)
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const startIndex = parseInt(searchParams.get("startIndex")) || 0;
    const postId = searchParams.get("postId");
    const sortDirection = searchParams.get("sort") == "desc" ? -1 : 1;
    
    await dbConnect()
    let filter = {};
    if (postId) filter.post = postId;
     
     
    const comments = await CommentModel.find(filter)
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("user", "name image")
      .populate("post","title slug image")

      

    const totalComments = await CommentModel.countDocuments(filter);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComment = await CommentModel.countDocuments({
      ...filter,
      createdAt: { $gt: oneMonthAgo },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Returned comments data",
        data: {
          comments,
          lastMonthComment,
          totalComments,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || error,
      },
      {
        status: 500,
      }
    );
  }
}



export async function DELETE(req) {

   
  const {searchParams} = new URL(req.url);
  const id = searchParams.get("id")
  try {
    if(!id) return errorHandler(401,"Comment id not found")
    await dbConnect()
    
    const deletedComment = await CommentModel.findByIdAndDelete(id).lean()

    if(!deletedComment) return errorHandler(401,"Error to delete comment")
    

    return NextResponse.json(
      {
        success: true,
        message: "Delete comments successfully",
       
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || error,
      },
      {
        status: 500,
      }
    );
  }
}
