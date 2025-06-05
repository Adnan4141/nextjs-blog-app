
import Link from "next/link";


import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import UserModel from "@/models/UserModel";
import CommentModel from "@/models/CommentModel";
import PostModel from "@/models/PostModel";
import DashLoading from "./DashLoading";
import Image from "next/image";

const DashboardOverview = async() => {
// Direct server-side fetching (Node.js or Next.js Server Component)
const users = await UserModel.find().sort({ updatedAt: -1 }).limit(5);
const comments =  await CommentModel.find().sort({ updatedAt: -1 }).limit(5);
const posts = await PostModel.find().sort({ updatedAt: -1 }).limit(5).select("-content");
const totalUsers = await UserModel.countDocuments();
const totalPosts = await PostModel.countDocuments();
const totalComments = await CommentModel.countDocuments();

const now = new Date();
const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

const lastMonthUsers = await UserModel.countDocuments({
  createdAt: { $gte: oneMonthAgo },
});
const lastMonthPosts = await PostModel.countDocuments({
  createdAt: { $gte: oneMonthAgo },
});
const lastMonthComments = await CommentModel.countDocuments({
  createdAt: { $gte: oneMonthAgo },
});




//   if (loading) return <DashLoading />;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[{
          label: "Total Users",
          total: totalUsers,
          lastMonth: lastMonthUsers,
          icon: <HiOutlineUserGroup className="text-white  text-3xl md:text-4xl bg-teal-600 p-2 rounded-full" />
        }, {
          label: "Total Comments",
          total: totalComments,
          lastMonth: lastMonthComments,
          icon: <HiAnnotation className="text-white text-3xl md:text-4xl bg-indigo-600 p-2 rounded-full" />
        }, {
          label: "Total Posts",
          total: totalPosts,
          lastMonth: lastMonthPosts,
          icon: <HiDocumentText className="text-white text-3xl md:text-4xl bg-lime-600 p-2 rounded-full" />
        }].map(({ label, total, lastMonth, icon }, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 shadow rounded-lg p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-medium">{label}</h4>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <span >{icon}</span>
            </div>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <HiArrowNarrowUp /> {lastMonth} <span className="ml-1 text-gray-500">Last month</span>
            </p>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Users</h3>
            <Link href="/dashboard?tab=users" className="text-blue-600 text-sm">See all</Link>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">User Image</th>
                  <th className="pb-2">Username</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="py-2">
                      <Image src={user?.image} width={90} height={90} alt="user" className="w-10 h-10 rounded-full" />
                    </td>
                    <td>{user?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Comments</h3>
            <Link href="/dashboard?tab=comments" className="text-blue-600 text-sm">See all</Link>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Content</th>
                  <th className="pb-2">Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment?._id} className="border-t">
                    <td className="py-2 line-clamp-2 max-w-xs">{comment?.content}</td>
                    <td>{comment?.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Posts */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Recent Posts</h3>
            <Link href="/dashboard?tab=posts" className="text-blue-600 text-sm">See all</Link>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Image</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} className="border-t">
                    <td className="py-2">
                      <img src={post.image} alt="post" className="w-14 h-10 rounded-md" />
                    </td>
                    <td>{post?.title}</td>
                    <td>{post?.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;