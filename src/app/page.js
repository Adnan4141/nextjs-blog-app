import CallToAction from "@/components/shared/CallToAction";
import PostCard from "@/components/shared/PostCard";
import { dbConnect } from "@/lib/dbConfig";
import PostModel from "@/models/PostModel";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Dev Blog - Web Development Tutorials & Resources",
    description: "Explore web development tutorials, programming guides, and tech resources. Learn JavaScript, React, Next.js and more from practical articles.",
    keywords: ["web development", "programming blog", "JavaScript tutorials", "React guides", "Next.js resources"],
    openGraph: {
      title: "Dev Blog - Web Development Tutorials & Resources",
      description: "Explore web development tutorials, programming guides, and tech resources.",
      url: "https://yourblog.com",
      type: "website",
      images: [
        {
          url: "https://yourblog.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Dev Blog - Web Development Resources",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dev Blog - Web Development Tutorials & Resources",
      description: "Explore web development tutorials, programming guides, and tech resources.",
      images: ["https://yourblog.com/twitter-image.jpg"],
    },
  };
}




const Home = async () => {
  await dbConnect();
  const postsDoc = await PostModel.find({}).sort({ createdAt: -1 }).limit(3).select("-content");
  const posts = JSON.parse(JSON.stringify(postsDoc));

  return (
    <div>
      <div className="flex flex-col gap-6 p-10 px-3 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold sm:text-2xl md:text-4xl lg:text-6xl pt-10">
          Welcome to my Blog
        </h1>
        <p className="text-gray-500 dark:text-gray-300 text-xl md:text-2xl">
          Welcome to my blog! Here you'll find a wide range of articles,
          tutorials, and resources designed to help you grow as a developer.
          Whether you're interested in web development, software engineering,
          programming languages, or best practices in the tech industry, there's
          something here for everyone. Dive in and explore the content to expand
          your knowledge and skills.
        </p>
        <Link
          href="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
        <div className="p-3 bg-amber-100 dark:bg-slate-700">
          <CallToAction />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-5">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="grid md:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-10">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              href={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;