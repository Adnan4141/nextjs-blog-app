"use client"

import GoogleLogin from "@/components/shared/GoogleLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";



import { useRouter } from "next/navigation";

import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";




const RegisterForm = () => {
  const [formData, setFormData] = useState({});
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const router = useRouter()
 

  const handleInputOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(null)
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    
    if(formData.password !== formData.cpassword)
      return setError("Confirm password does not match")

    setError(null)
    setLoading(true)
    
    try {
      const res = await axios.post("/api/register", formData);
      
      if(res.data.success){
         toast.success(res.data.message)
         router.push("/login")
      }
      console.log(res)
     setLoading(false)
    } catch (error) {
      console.log(error?.response.data.message);
      setLoading(false)
      setError(error?.response.data.message || error.message ||error);
    }
  };


  return (
      <>
        <form onSubmit={handleOnSubmit} className="flex flex-col  gap-3 ">
          <Input
            type="text"
            name="name"
            autoComplete="name"
               required
            placeholder="Enter your name"
            onChange={handleInputOnChange}
            className="bg-gray-100 border dark:bg-[#272F3D] dark:focus:ring-2   dark:border-none border-gray-300 focus:outline-none focus:ring focus:ring-blue-700 px-4 py-2 rounded-md"
          />
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            onChange={handleInputOnChange}
            className="bg-gray-100 border dark:bg-[#272F3D] dark:focus:ring-2   dark:border-none border-gray-300 focus:outline-none focus:ring focus:ring-blue-700 px-4 py-2 rounded-md"
          />
          <Input
            type="password"
            placeholder="Password"
            name="password"
            required
            autoComplete="current-password"
            onChange={handleInputOnChange}
            className="bg-gray-100 border dark:bg-[#272F3D] dark:focus:ring-2   dark:border-none border-gray-300 focus:outline-none focus:ring focus:ring-blue-700 px-4 py-2 rounded-md"
          />
          <Input
            type="password"
            placeholder="Confirm your password"
            name="cpassword"
            required    
            autoComplete="confirm-password"
            onChange={handleInputOnChange}
            className="bg-gray-100 border dark:bg-[#272F3D] dark:focus:ring-2   dark:border-none border-gray-300 focus:outline-none focus:ring focus:ring-blue-700 px-4 py-2 rounded-md"
          />

          <Button
            type="submit"
            className={"bg-blue-800  cursor-pointer py-5 text-white"}
          > 
          {
            loading ?
              <>
            <CgSpinner className="animate-spin"/>
            Loading....
            </> :
            "Login"
          }
           
          </Button>
        </form>
        <GoogleLogin/>  
        
        {error && <div
          className={`bg-red-100  border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm `}
        >
         {error}
        </div>}
   
        
      </>
  )
}

export default RegisterForm
