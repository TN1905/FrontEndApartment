import React, { useState, useEffect, useContext } from "react";
import { HouseContext } from "../Apartment/HouseContext";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getApprovePoster } from "../../api/approvePoster/getAprrovePoster";
import { updateApprovePoster } from "../../api/approvePoster/updateApprovePoster";
import { deleteApprove } from "../../api/approvePoster/deleteApprovePoster";
import { addRole } from "../../api/users/addRole";
import { getUsername } from "../../api/users/getUsers";

const ApproveRegisterPoster = () => {
  const { user } = useContext(HouseContext);
  const [registerData, setRegisterData] = useState([]);

  useEffect(() => {
    const initiate = async () => {
      const data = await getApprovePoster();
      if (data) {
        console.log(data);
        setRegisterData(data);
      }
    };
    initiate();
  }, []);

  const handleApprove = async (approveData) => {
    const userData = await getUsername(approveData.username);
    if (userData) {
      const Approdata = await updateApprovePoster(approveData.id, approveData);
      if (Approdata) {
        await addRole(userData.id, userData)
          .then((data) => {
            console.log("Update thành công", data);
            setRegisterData((prevData) =>
              prevData.filter((item) => item.id !== approveData.id)
            );
          })
          .catch((error) => {
            console.log("Update thất bại", error);
          });
      }
    }
  };

  const handleRefuse = async (approveId) => {
    await deleteApprove(approveId);
    setRegisterData((prevData) =>
      prevData.filter((item) => item.id !== approveId)
    );
  };

  return (
    <main className="flex-1 p-6">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>AccountId</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registerData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.id}</TableCell>
                <TableCell>{data.accountId}</TableCell>
                <TableCell>{data.username}</TableCell>
                <TableCell className="text-right space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"                   
                      >
                        Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve this user as a
                          Poster?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleApprove(data)}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"                     
                      >
                        Refuse
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Refuse User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to refuse this user as a Poster?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRefuse(data.id)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};

export default ApproveRegisterPoster;
