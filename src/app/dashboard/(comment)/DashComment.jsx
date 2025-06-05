"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import DeletePostActionButton from "@/components/action-button/DeletePostButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteCommentModal from "./DeleteModal";
import { FaRegCommentDots } from "react-icons/fa";

const truncate = (text = "", max = 40) =>
  text.length > max ? text.slice(0, max) + "..." : text;

const DashComment = () => {
  const [comments, setComments] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments?limit=20&page=${page}`);
        if (res.data.success) {
          console.log(res.data);
          setComments(res.data.data.comments);
          setTotalPages(res.data?.pagination?.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchComments();
  }, [page]);

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  };

  if(comments && !comments.length>0)
    return( <div className="w-full pt-32 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
      <FaRegCommentDots size={48} className="mb-4" />
      <h2 className="text-lg font-semibold">No comments available</h2>
      <p className="text-sm mt-1">Be the first to start the conversation!</p>
    </div>)



  return (
    <div className="p-4 mx-auto max-w-6xl ">
      <Table className={"mb-20"}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="w-[100px]">Content</TableHead>
            <TableHead className="w-[100px]">Username</TableHead>
            <TableHead>Post Title</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment._id}>
              <TableCell>
                <Image
                  src={comment?.post?.image || ""}
                  width={90}
                  height={90}
                  alt={comment.content || "Comment image"}
                  className="rounded w-20 h-16"
                />
              </TableCell>
              <TableCell className="font-medium">
                {truncate(comment?.content)}
              </TableCell>
              <TableCell>{comment?.user?.name}</TableCell>
              <TableCell className={"hover:underline cursor-pointer"}>
                <Link href={`/post/${comment?.post?.slug}`}>{truncate(comment?.post?.title)}</Link>
              </TableCell>
              <TableCell>
                {new Date(comment?.createdAt).toDateString()}
              </TableCell>
              <TableCell className={"space-x-2"}>
              <DeleteCommentModal commentId={comment?._id} comments={comments} setComments={setComments}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

     { comments && comments.length>9 &&
       <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
     }
    </div>
  );
};

export default DashComment;
