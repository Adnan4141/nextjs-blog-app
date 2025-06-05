"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import TinyMCE from "@/components/RichTextEditor/TinyMCE";
import { useRouter } from "next/navigation";

export const metaData = {
  title: "Create a New Post",
  description:
    "Use this form to create and publish a new post on the platform.",
  keywords: "create post, blog, new article, publish content",
  openGraph: {
    title: "Create a New Post",
    description: "Easily create and share your blog content.",
    url: process.env.NEXT_PUBLIC_FRONTENT_URL,
    type: "website",
  },
};

const CreatePostForm = ({distinctCategories}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState(distinctCategories || []);
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleUploadImage = async () => {
    if (!file) return;
    const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;
    const cloud_name = process.env.NEXT_PUBLIC_CLOUD_NAME;
    const fileData = new FormData();
    fileData.append("file", file);
    fileData.append("upload_preset", upload_preset);
    fileData.append("cloud_name", cloud_name);

    setImageLoading(true);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        fileData
      );
      if (res.data) {
        setFormData((prev) => ({ ...prev, image: res.data.secure_url }));
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Please upload the image");

    setLoading(true);
    setError(null);
    console.log(formData);

    try {
      const res = await axios.post("/api/posts", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ title: "", category: "", content: "", image: "" });
        setFile(null);
        router.push("/dashboard?tab=posts");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 py-20   max-w-3xl mx-auto bg-gray-100 shadow   text-gray-900 dark:text-white  dark:bg-gray-900 rounded-xl my-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a Post</h1>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Post Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
          required
        />

        {/* Category */}
        {!addingNewCategory ? (
          <select
            value={formData.category}
            onChange={(e) => {
              if (e.target.value === "__add_new__") {
                setAddingNewCategory(true);
                setFormData({ ...formData, category: "" });
              } else {
                setFormData({ ...formData, category: e.target.value });
              }
            }}
            className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__add_new__">➕ Add New Category</option>
          </select>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
            />
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => {
                if (newCategory.trim()) {
                  const trimmed = newCategory.trim().toLowerCase();
                  if (!categories.includes(trimmed)) {
                    setCategories([...categories, trimmed]);
                  }
                  setFormData({ ...formData, category: trimmed });
                  setNewCategory("");
                  setAddingNewCategory(false);
                }
              }}
            >
              ✅
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => {
                setNewCategory("");
                setAddingNewCategory(false);
              }}
            >
              ❌
            </button>
          </div>
        )}

        {/* Image Upload */}
        <div className="border-2 border-dashed border-teal-500 p-4 flex flex-col gap-4 items-start">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="file-input"
          />
          <button
            type="button"
            onClick={handleUploadImage}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {imageLoading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="w-full">
            <img
              src={formData.image}
              alt="Preview"
              className="max-h-72 object-contain mx-auto"
            />
          </div>
        )}

        {/* Content */}

        <TinyMCE formData={formData} setFormData={setFormData} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || imageLoading}
          className="w-full py-3 bg-purple-700 text-white font-semibold rounded hover:bg-purple-800 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
      {error && (
        <div
          className={`bg-red-100 my-5  border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm `}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;
