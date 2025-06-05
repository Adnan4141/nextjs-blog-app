"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DeleteCommentModal = ({ commentId,setComments,comments }) => {

 const [loading, setLoading] = useState(false);
 
 const handleCommentDelete = async(id)=>{
      try {
          setLoading(true);
         const res = await axios.delete(`/api/comments?id=${commentId}`)
         
         if(res.data.success){
            toast.success(res.data.message)
            setComments((prev)=>(
               prev.filter(c=>c._id!==id)
            ))
         }
      
      } catch (error) {
           toast.error(error.message || error)
         
      }finally {
    setLoading(false);
  }
 }
 
 
 
 
 
 
   return (
    <AlertDialog>
      <AlertDialogTrigger disable={loading} className="bg-red-600 px-3 py-1 cursor-pointer  rounded">
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent className={"dark:bg-slate-700 "}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete comment?</AlertDialogTitle>
          <AlertDialogDescription >
            This action cannot be undone. This will permanently delete your
            comment  from this blog post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
          <AlertDialogAction   onClick={()=>handleCommentDelete(commentId)} className={"cursor-pointer"}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCommentModal;
