"use client";
import { CgSpinner } from "react-icons/cg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import GoogleLogin from "@/components/shared/GoogleLogin";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()
  const {data:session}  = useSession();
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard?tab=profile" 
   


useEffect(() => {
  if (session?.user && router) {
    if (window.location.pathname + window.location.search !== callbackUrl) {
      router.push(callbackUrl);
    }
  }
}, [session?.user, router, callbackUrl]);



  const handleInputOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null);
  };



  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null)

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
     
      if(res.ok){
         setError(null)
         toast.success("Logging successfully")
          router.push(callbackUrl)
        }else{
         setError(res.error)
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError( error.message)
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleOnSubmit} className="flex flex-col  gap-4 ">
        <Input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          onChange={handleInputOnChange}
          className="bg-gray-100
            
            border  dark:bg-[#272F3D] text-2xl dark:focus:ring-2   dark:border-none  border-gray-300 focus:outline-none focus:ring focus:ring-blue-700 px-4 py-5 rounded-md"
        />
        <Input
          type="password"
          placeholder="**********"
          name="password"
          autoComplete="current-password"
          onChange={handleInputOnChange}
          className="bg-gray-100 py-5  dark:bg-[#272F3D] dark:focus:ring-2   dark:border-none  border border-gray-300 focus:outline-none focus:ring focus:ring-blue-700 px-4  rounded-md"
        />

        <Button
          type="submit"
          className={"bg-blue-800  cursor-pointer py-5 text-white"}
        >
          {loading ? (
            <>
              <CgSpinner className="animate-spin" />
              Loading
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <GoogleLogin />
      {error && (
        <div
          className={`bg-red-100  border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm `}
        >
          {error}
        </div>
      )}
    </>
  );
};

export default LoginForm;
