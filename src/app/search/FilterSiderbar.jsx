"use client"
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";


const FilterSiderbar = ({
  categoriesData
}) => {
  const searchParams = useSearchParams();
  
  
  const categories = categoriesData || []
  const [filters, setFilters] = useState({
    searchTerm:  searchParams.get("searchTerm") || "",
    sort: "desc",
    category: "",
  })
 const router = useRouter()


  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(filters)
    const query = new URLSearchParams(filters).toString();
    router.push(`/search?${query}`);
  };

  return (
    <aside className="md:w-1/4 p-6 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-3">
          🔍 Filter Posts
        </h2>

        <div className="relative">
          <input
            id="searchTerm"
            name="searchTerm"
            type="text"
            value={filters?.searchTerm}
            onChange={handleChange}
            className="peer cursor-pointer w-full px-3 py-3 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
            placeholder=" "
          />
          <label
            htmlFor="searchTerm"
            className="absolute left-3 top-0 text-gray-500 dark:text-gray-400 text-sm peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:text-xs peer-focus:text-teal-600 dark:peer-focus:text-teal-400 transition-all"
          >
            Search term
          </label>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Sort
          </label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full cursor-pointer px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block mb-1  text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full capitalize px-3 cursor-pointer py-2 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">All</option>
            {categories.map((category, idx) => (
              <option className="capitalize" key={idx} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-200"
        >
          Apply Filters
        </button>
      </form>
    </aside>
  );
};

export default FilterSiderbar;
