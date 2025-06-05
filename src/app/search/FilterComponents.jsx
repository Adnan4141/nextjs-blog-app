"use client"

import PostCard from '@/components/shared/PostCard';
import React, { useState } from 'react'

const FilterComponents = ({posts, categoriesData}) => {

   
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const query = new URLSearchParams({ ...filters, startIndex }).toString();
    const res = await fetch(`/api/posts/?${query}`);
    const data = await res.json();
    setPosts([...posts, ...data.data]);
    setShowMore(data.data?.length === 9);
  };






  return (
      <main className="w-full p-6">
        <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
          Search Results
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div className="col-span-full text-center text-gray-600 dark:text-gray-400">
              No posts found. Try different filters.
            </div>
          )}
          {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>

        {showMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMore}
              className="text-teal-600 dark:text-teal-400 hover:underline font-medium text-sm"
            >
              Show More Posts
            </button>
          </div>
        )}
      </main>
  )
}

export default FilterComponents
