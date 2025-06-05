import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const CallToAction = ({}) => {
  return (
    <div className="flex flex-col bg-gray-200  sm:flex-row gap-5 p-3 border text-center border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1 flex flex-col justify-center ">
        <h2 className='text-2xl'>Want to learn more about MERN</h2>
        <p className='text-gray-500 my-2'>Checkout these resources with MERN Projects</p>
        <Button className="bg-gradient-to-t text-white rounded w-full rounded-bl-none from-purple-700 via-fuchsia-950 to-pink-800">
          <Link href="">Learn more</Link>
        </Button>
      </div>
      <div className="flex-1 p-7">
        <img
          src={
            "https://www.creativeitinstitute.com/images/course/course_1740808396.jpg"
          }
          alt="CallImage"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CallToAction;