"use client";
import { AiFillLike } from "react-icons/ai";
import { SubmitCommentAction } from "@/app/actions/SubmitCommentAction";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { likedCommentAction } from "@/app/actions/LikedCommentAction";
import axios from "axios";
import LoadingCommment from "./LoadingComment";
import EditComment from "./EditComment";
import UserComment from "./UserComment";
import Link from "next/link";

const CommentSection = ({ postId }) => {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/comments?postId=${postId}`);
        // console.log(res.data);
        if (res?.data?.success) {
          setComments(res?.data?.data.comments);
        }
        setLoading(false);
      } catch (error) {
        console.log(error.message || error);
        setLoading(false);
      }
    };
    if (session?.user) {
      fetchComments();
    }
  }, [session?.user]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        content: text,
        user: session?.user?._id,
        post: postId,
      };

      const res = await SubmitCommentAction(payload);
      if (res?.success) {
        const currentComments = [...comments, res?.data];
        setComments(currentComments);
        return toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  if (status === "loading") return <LoadingSpinner />;

  return (
    <div className="my-20 ">
      {session?.user ? (
        <form
          onSubmit={handleSubmitComment}
          className="border-2 shadow-lg  border-blue-500 rounded-xl p-4 space-y-5  
          w-full 
          md:w-2/3 mx-auto"
        >
          <textarea
            placeholder="Add a comment..."
            className="w-full p-3 border-2  border-blue-500   focus:outline-blue-500  dark:focus:outline-none dark:focus:border-blue-500 dark:focus:ring-blue-500  rounded-xl"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            name="message"
            id="message"
          ></textarea>

          <div className="flex justify-between ">
            <p className="text-sm">{200 - text.length} characters remaining</p>
            <Button
              type="submit"
              className={
                "text-blue-500 hover:bg-cyan-950 active:scale-105 cursor-pointer  border-[2px] border-t-purple-800 border-l-purple-700 border-r-blue-700 border-b-blue-500 "
              }
              variant={"destructive"}
            >
              Submit
            </Button>
          </div>
        </form>
      ) : (
       <p className="text-gray-400">
  You must be <Link href={`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`} className="text-blue-500 underline">logged in</Link> to comment
</p>
      )}

      <div>
        <div className="flex gap-2 items-center pt-10">
          <p>Comments</p>
          <span className="border border-gray-400 px-2 py-1">
            {comments?.length}
          </span>
        </div>

        <ul className=" p-5">
          {loading && <LoadingCommment />}
          {!loading &&
            comments &&
            comments?.map((comment) => (
              <li key={comment?._id} className="flex gap-2 py-1">
                <Image
                  src={comment?.user?.image}
                  alt="User photo"
                  width={740}
                  className="rounded-full w-12 h-12 "
                  height={320}
                />
                <div className="">
                  <div className="flex gap-3 items-center">
                    <h4 className="text-sm font-semibold">
                      @{comment?.user.name}
                    </h4>
                    <span className="text-xs text-gray-400">8 mins ago</span>
                  </div>
                  <UserComment
                    {...{ comments, setComments, comment, session }}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default CommentSection;
