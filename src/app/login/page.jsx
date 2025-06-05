


import Link from "next/link";
import LoginForm from "./LoginForm";

export default function Login() {
  
 
  return (
    <div
      className={`flex  flex-col md:min-h-screen md:-mt-20 md:items-center max-w-7xl mx-auto md:flex-row gap-5 justify-center px-10 md:px-20 py-20`}
    >
      <div className="flex-1 ">
        <div className="flex items-center font-bold dark:text-white text-2xl">
          <h2 className="bg-gradient-to-r text  font-bold px-2 py-1 text-white via-purple-500   rounded from-indigo-500 to-pink-500">
            Adnan's
          </h2>
          <span>Blog</span>
        </div>
        <p>
          This is a demo project. You can sign in with your email and password
          or with Google.
        </p>
      </div>

      <div className=" flex-1 space-y-3 px-5 md:px-10">
        <LoginForm/> 
        <div className="flex gap-2 mt-5 text-sm text-gray-500">
          <p>Don't have an account?</p>
          <Link href={"/register"}>
            <span className="text-blue-700">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
