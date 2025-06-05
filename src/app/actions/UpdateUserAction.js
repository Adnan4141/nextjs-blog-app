"use server";

import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/UserModel";

export async function UpdateUserAction(userId, updatedDoc) {
  if (!userId) return { success: false, message: "User ID is required" };
  if (!updatedDoc)
    return { success: false, message: "Updated document required" };
  const { name, password } = updatedDoc;

  try {
    await dbConnect();
    const updatedUser = await UserModel.findById(userId);
    if (!updatedUser) return { success: false, message: "User was not found" };
   
    if(name) updatedUser.name = name
    if(password) updatedUser.password = password
     
    await updatedUser.save();
  
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    console.log("Server action failed", error.message);
    return { success: false, message: error.message || error };
  }
}
