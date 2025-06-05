import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, email, password } = await req.json();

    if (!email && !name && !password)
      return NextResponse.json(
        { success: false,
          message: "Please provide the required field" },
        { status: 400 }
      );

    const existsUser = await UserModel.findOne({
      email
    })
    

    if(existsUser) {
        return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

     const newUser = new UserModel({
      name,
      email,
      password,
      provider:"credentials"
     })

     await newUser.save();

    return NextResponse.json(
      { 
        success:true, 
        message: "User created successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
