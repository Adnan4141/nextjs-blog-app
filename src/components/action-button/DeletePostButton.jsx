"use client";



import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DeletePostActionButton = ({ postId,setPosts,posts }) => {
     

  const handleDelete = async () => {
    if(!postId) return
    try {
       const res = await axios.delete(`/api/posts/${postId}`)
     
       if(res.data.success){
         toast.success(res.data.message)
         const modifyPosts = posts.filter(post=>post._id !==postId)
         setPosts(modifyPosts)
       }
      
      } catch (error) {
        console.log(error)
        //  toast.error(error?.response.data.message|| error.message)
    }
  };

  return (
    <Button
      className={"bg-red-700 text-white cursor-pointer"}
      variant={"secondary"}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};

export default DeletePostActionButton;
