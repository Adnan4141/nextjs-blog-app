import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { convert } from "html-to-text";
import { extractTextFromHtml } from "@/lib/htmlToText";

export default function PostCard({ post }) {
  

  
  
  
  return (
    <article className="group relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900">
      
      <Link href={`/post/${post.slug}`} className="block relative h-[260px] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post?.title || "Post image"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-covertransition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-6 pb-24 relative z-10 space-y-3">
        {/* Category & Date */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-block bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 px-3 py-1 rounded-full font-semibold tracking-wide">
            {post.category}
          </span>
          {post.createdAt && (
            <span className="text-neutral-500 dark:text-neutral-400">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-snug min-h-[3.5rem] line-clamp-2">
          <Link
            href={`/post/${post.slug}`}
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        {(
          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed line-clamp-3">
          {post?.description}
          </p>
        )}

        {/* Button */}
        <div className="absolute  group-hover:scale-105 mt-5 left-6 right-6 transition-all duration-500">
          <Link
            href={`/post/${post.slug}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-teal-700 dark:to-cyan-700 dark:hover:from-teal-600 dark:hover:to-cyan-600 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-lg backdrop-blur-sm"
          >
            Read Article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
