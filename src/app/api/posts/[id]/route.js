import { dbConnect } from "@/lib/dbConfig";
import { errorHandler } from "@/lib/ErrorHandler";
import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import { extractTextFromHtml } from "@/lib/htmlToText";
import PostModel from "@/models/PostModel";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const {id} = await params;
    
    const res = await PostModel.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
       message:"Successfully Delete the Post",
       result:res
      });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message:error.message || "Failed to Delete post", error: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });
    }
 
    await dbConnect();
    const {id} = await params;

    const { title, category, content, image } = await req.json();
     
    const updatedPost = await PostModel.findById(id);
    
    if(!updatedPost)return errorHandler(404,"Post not found");

     if(category) updatedPost.category = category;
    if(image) updatedPost.image = image;

     if(title) {
      updatedPost.title = title;
      updatedPost.slug = await generateUniqueSlug(title, PostModel);
     }

    if(content) {
      updatedPost.content = content
      updatedPost.description =  extractTextFromHtml(content)
    };



    await updatedPost.save();

    return NextResponse.json({
      message: "Update the Post Successfully",
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error("Error update posts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update posts" },
      { status: 500 }
    );
  }
}
