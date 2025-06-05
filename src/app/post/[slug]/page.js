import CallToAction from "@/components/shared/CallToAction";
import PostCard from "@/components/shared/PostCard";
import PostModel from "@/models/PostModel";
import Image from "next/image";
import Link from "next/link";


export async function generateMetaData({params}) {
   const postDoc = await PostModel.findOne({slug:params.slug}).select("-content").lean();
   const post  = JSON.parse(JSON.stringify(postDoc));

  if(!post){
    return {
      title:"Post Not Found",
      description:"The requested blog post could not be found"
    }
  }


const description = post.description || ""

return {
  title:post.title,
  description,
  openGraph:{
    title:post.title,
    description,
    images:post.image?[
      {
        url:post.image,
        width:800,
        height:600,
        alt:post.title
      }
    ]:[],
    type:"article"
  },
  twitter:{
    card:"summary_large_image",
    title:post.title,
    description,
    images:post.image? [post.image]:[]
  },
  alternates:{
    canonical:`${process.env.NEXT_PUBLIC_FRONTENT_URL}/post/${post.slug}`
  }
}





}









const PostPage = async ({ params }) => {
  const { slug } = await params;

  const postDoc = await PostModel.findOne({ slug }).lean();
  const post = JSON.parse(JSON.stringify(postDoc));

  const recentPostsDoc = await PostModel.find({})
    .sort({ createdAt: -1 })
    .select("-content")
    .limit(3)
    .lean();
  const recentPosts = JSON.parse(JSON.stringify(recentPostsDoc));

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post?.title}
      </h1>
      <Link
        className="self-center mt-5"
        href={`/search?category=${post?.category}`}
      >
        <button className="border border-gray-300 px-4 py-1 rounded text-gray-800 hover:bg-gray-100">
          {post?.category}
        </button>
      </Link>
      {post?.image && (
        <Image
          src={post?.image}
          alt={post?.title}
          width={400}
          height={600}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
      )}
      <div className="flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post &&
            `${Math.ceil(
              post.content
                .replace(/<[^>]+>/g, "")
                .trim()
                .split(/\s+/).length / 200
            )} mins read`}
        </span>
      </div>

      <div
        className="p-3 content-preview mt-5 prose prose-invert mx-auto w-full"
        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
      ></div>

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/* <CommentSection postId={post?._id} /> */}

      <section className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-2xl mt-5">Recent articles</h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </section>
    </main>
  );
};

export default PostPage;
