import { editCommentAction } from "@/app/actions/EditCommentAction";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const EditComment = ({ comment, setComments, comments, setIsEdited }) => {
  const [newText, setNewText] = useState("");

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      if (!newText.trim()) {
        return setIsEdited(null)
      };

      const res = await editCommentAction(newText, comment?._id);

      if (res?.success) {
        const updatedComments = comments.map((item) =>
          item._id == comment._id
            ? {
                ...item,
                content: newText,
              }
            : item
        );
        setComments(updatedComments)
        setIsEdited(null);

        return toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitComment} className="py-2">
        <textarea
          placeholder="Add a comment..."
          className="w-full p-3 border-2  border-blue-500   focus:outline-blue-500  dark:focus:outline-none dark:focus:border-blue-500 dark:focus:ring-blue-500  rounded-xl"
          rows={4}
          defaultValue={comment?.content}
          onChange={(e) => setNewText(e.target.value)}
          name="message"
          id="message"
        ></textarea>

        <div className="space-x-2">
          <Button
            type="button"
            onClick={()=>setIsEdited(null)}
            className={
              "text-red-500  hover:bg-red-800 hover:text-white active:scale-105 cursor-pointer  border-[2px]  border-red-800 "
            }
            variant={"destructive"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={
              "text-blue-500 hover:bg-cyan-950 active:scale-105 cursor-pointer  border-[2px] border-t-purple-800 border-l-purple-700 border-r-blue-700 border-b-blue-500 "
            }
            variant={"destructive"}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditComment;
