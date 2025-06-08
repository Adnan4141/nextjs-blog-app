"use client"

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { AiFillGoogleCircle } from "react-icons/ai";
import { useSearchParams } from "next/navigation";



const GoogleLogin = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard?tab=profile" 
   



 const hanldePopupSignin = async () => {
    await signIn("google",{callbackUrl});
  };



  return (
     <div className="w-full">
          <Button
            onClick={hanldePopupSignin}
            className={
              "bg-gradient-to-r cursor-pointer py-5 from-pink-500  to-orange-500 w-full text-white"
            }
          >
            <AiFillGoogleCircle className="text-2xl" />
            Continue with Google
          </Button>
        </div>
  )
}

export default GoogleLogin
