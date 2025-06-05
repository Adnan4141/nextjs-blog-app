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

const truncate = (text = "", max = 20) =>
  text.length > max ? text.slice(0, max) + "..." : text;

const DashPosts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts?limit=7&page=${page}`);
        if (res.data.success) {
          console.log(res.data);
          setPosts(res.data.data);
          setTotalPages(res.data.pagination.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [page]);

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  };

  if (posts && !posts.length > 0)
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
        <svg
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 6h16M4 10h16M4 14h10M4 18h6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-lg font-semibold">No posts found</h2>
        <p className="text-sm mt-1">
          Try searching with a different keyword or check back later.
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      {/* Scrollable table on small screens */}
      <div className="overflow-x-auto">
        <Table className="min-w-full mb-20 text-sm lg:text-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow className={"h-16 "} key={post._id}>
                <TableCell>
                  <Image
                    src={post.image}
                    width={90}
                    height={90}
                    alt={post.title}
                    className="rounded"
                  />
                </TableCell>
                <TableCell>{truncate(post.title)}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <Link className="hover:underline" href={`/post/${post.slug}`}>
                    {truncate(post.slug)}
                  </Link>
                </TableCell>
                <TableCell>{new Date(post.createdAt).toDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/update-post/${post._id}`}>
                    <Button className="bg-green-700 cursor-pointer text-white">
                      Edit
                    </Button>
                  </Link>
                  <DeletePostActionButton
                    setPosts={setPosts}
                    posts={posts}
                    postId={post._id.toString()}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {posts && posts.length > 9 && (
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
      )}
    </div>
  );
};

export default DashPosts;
