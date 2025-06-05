import { dbConnect } from "@/lib/dbConfig";
import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import PostModel from "@/models/PostModel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { extractTextFromHtml } from "@/lib/htmlToText";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;


    const posts = await PostModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user", "name image")
      .lean();

    const total = await PostModel.countDocuments();

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
 
    await dbConnect();
    const { title, category, content, image } = await req.json();
     
    
    
     if (!title || !category || !content || !image)
      return NextResponse.json(
        {
          message: "Please provide the required filed",
        },
        { status: 401 }
      );

    const description =  extractTextFromHtml(content);

    const generatedSlug = await generateUniqueSlug(title, PostModel);

    const newPosts  = new PostModel({
      title,
      category,
      content,
      image,
      slug:generatedSlug ,
      user:session?.user?._id,
      description
    })

    await newPosts.save();

    return NextResponse.json({
      message: "Create the Post Successfully",
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
