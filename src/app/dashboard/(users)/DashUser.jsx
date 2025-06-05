import DeleteButtonComponent from "@/components/action-button/DeleteUserButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dbConnect } from "@/lib/dbConfig";
import UserModel from "@/models/UserModel";
import Image from "next/image";

const DashUser = async () => {
  await dbConnect()
  const usersData = await UserModel.find({});

  return (
    <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Admin</TableHead>
          <TableHead>Provider</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {usersData &&
          usersData.map((user) => (
            <TableRow key={user._id}>
              <TableCell><Image src={user?.image} alt={user?.name} width={50} height={90} /></TableCell>
              <TableCell className="font-medium">{user?.name}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>{user?.provider}</TableCell>
              
              <TableCell className=" text-center">{
              !user?.isAdmin ? 
              ( <DeleteButtonComponent key={user._id.toString} userId={user._id.toString()}/>)
               : "-"
            }
               
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default DashUser;
