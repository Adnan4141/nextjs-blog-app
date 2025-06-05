"use client"

import { deleteUserAction } from "@/app/actions/DeleteUserActions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DeleteActionButton = ({userId}) => {
  const router = useRouter()
  const handleDelete = async()=>{
    const res = await deleteUserAction(userId);
    console.log(res)
    router.refresh()
  }



  return (
    <Button
      className={"bg-red-700 text-white cursor-pointer"}
      variant={"secondary"}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};

export default DeleteActionButton;
