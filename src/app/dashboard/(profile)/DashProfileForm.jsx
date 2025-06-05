"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { UpdateUserAction } from "@/app/actions/UpdateUserAction";
import { deleteUserAction } from "@/app/actions/DeleteUserActions";
import Image from "next/image";

const DashProfileForm = () => {
  const filePickerRef = useRef();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formdata, setFormData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setCurrentUser(session?.user);
    }
  }, [session?.user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFileUrl(URL.createObjectURL(file));

    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

    const fileFormData = new FormData();
    fileFormData.append("file", file);
    fileFormData.append("upload_preset", uploadPreset);
    fileFormData.append("cloud_name", cloudName);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        fileFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        }
      );

      setImageFileUrl(res.data.secure_url);
      setFormData((prev) => ({ ...prev, profilePicture: res.data.secure_url }));
    } catch (error) {
      console.error(error.message);
    } finally {
      setProgress(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await UpdateUserAction(currentUser?._id, formdata);
      console.log(res);
      if (res.success) {
        toast.success(res.message);
        setCurrentUser(res.data);
      }
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteUserAction(id);
      if (res.success) {
        setOpenModal(false)
        toast.success(res.message)
      }
      console.log(res);
    } catch (error) {
      toast.error(error?.message || "Error occured");
      console.log(error);
    }
  };

  if (!currentUser) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="mb-4">This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={()=>handleDeleteUser(currentUser?._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="flex flex-col">
        <div
          onClick={() => filePickerRef.current.click()}
          className="w-32 relative h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
        >
          {progress && (
            <CircularProgressbar
              value={progress || 0}
              text={`${progress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${progress / 100})`,
                },
              }}
            />
          )}

          <Image
            src={imageFileUrl || currentUser?.image}
            alt="user"
            width={100}
            height={100}
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>

        <input
          type="file"
          ref={filePickerRef}
          onChange={handleImageChange}
          accept="image/*"
          className="mt-5"
          hidden
        />

        <div className="space-y-5 mt-10">
          <input
            type="text"
            id="name"
            onChange={handleInputChange}
            placeholder="Name"
            defaultValue={currentUser?.name}
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            id="email"
            placeholder="Email"
            defaultValue={currentUser?.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />

          <input
            type="password"
            id="password"
            autoComplete="current-password"
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
          />

          <button
            disabled={(progress > 0 && progress < 100) || loading}
            type="submit"
            className="w-full border p-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-50"
          >
            {loading || (progress > 0 && progress < 100)
              ? "Updating..."
              : "Update"}
          </button>
        </div>

        <div className="text-red-500 flex justify-between my-10">
          <button
            type="button"
            onClick={() => setOpenModal(true)}
            className="cursor-pointer outline p-2 hover:outline-red-900 outline-red-500"
          >
            Delete Account
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer outline p-2 hover:outline-red-900 outline-red-500"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashProfileForm;
