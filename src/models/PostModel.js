import { generateUniqueSlug } from "@/lib/generateUniqueSlug";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default:
        "https://img.freepik.com/free-vector/blog-post-concept-illustration_114360-26355.jpg?semt=ais_hybrid&w=740",
    },
    category: {
      type: String,
      default: "uncategorized",
      required: true,
    },
    description: {
      type: String,
      default:""
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


postSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = await generateUniqueSlug(this.title, mongoose.models.Post || this.constructor);
  }
  next();
});

const PostModel =  mongoose.models.Post || mongoose.model("Post", postSchema);

export default PostModel;

