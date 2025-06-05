import FilterSiderbar from "./FilterSiderbar";
import FilterComponents from "./FilterComponents";
import { dbConnect } from "@/lib/dbConfig";
import PostModel from "@/models/PostModel";

export default async function SearchPage({ searchParams }) {
  await dbConnect();

  const searchTerm = (await searchParams)?.searchTerm || "";
  const sort = (await searchParams)?.sort == "asc" ? 1 : -1;
  const category = (await searchParams)?.category || "";

  let filter = {};
  if (category) filter.category = category;
 
  if(searchTerm){
    filter.$or = [
      {title:{$regex:searchTerm,$options:"i"}},
      {description:{$regex:searchTerm,$options:"i"}}
    ]
  }


  const categoriesData = await PostModel.distinct("category").lean();
  const postsDoc = await PostModel.find(filter)
    .select("-content")
    .sort({ createdAt: sort });

  const posts = JSON.parse(JSON.stringify(postsDoc));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}

      <FilterSiderbar categoriesData={categoriesData} />
      {/* Main */}
      <FilterComponents {...{ posts, categoriesData }} />
    </div>
  );
}
