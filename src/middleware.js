import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function getUserFromNextAuthJWT(token) {
  if (!token) return null;

  try {
    const  payload  = await jwtVerify(token, process.env.NEXTAUTH_SECRET);
     console.log("payload",payload)
    return payload;
  } catch(err) {
    console.log(err.message)
    return null;
  }
}




export async function middleware(req) {
    const url = req.nextUrl.clone()
    // const token = req.cookies.get("next-auth.session-token")?.value 
    

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie:  "development",
  });

  console.log("middlware token.........",token)



    // console.log(token)
  //  const user = await getUserFromNextAuthJWT(token);
  //  console.log(user)
    // console.log("url..........",url)
    // return NextResponse.redirect(new URL("/dashboard?tab=posts",req.url))
}

export const config = {
    matcher:["/about"]
}