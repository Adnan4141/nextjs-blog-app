"use server";

import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/UserModel";

export async function deleteUserAction(userId) {
  
   try {
    await dbConnect();
     const existsUser = await UserModel.findById(userId);

     if(!existsUser)return { success: false, message:"User was not found"};

    const result =  await UserModel.findByIdAndDelete(userId);

    return { success: true, message: "User deleted successfully",data:JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    console.log("Server action failed", error.message);
    return { success: false, message: error.message || error };
  }
}
