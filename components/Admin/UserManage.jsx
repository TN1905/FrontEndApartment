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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { getApprovePoster } from "../../api/approvePoster/getAprrovePoster";
import { updateApprovePoster } from "../../api/approvePoster/updateApprovePoster";
import { deleteApprove } from "../../api/approvePoster/deleteApprovePoster";
import { addRole } from "../../api/users/addRole";
import { getUsername } from "../../api/users/getUsers";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {getListUsers} from "../../api/users/getListUsers";
import { updateAccount } from "../../api/users/updateUser";
const UserManagement = () => {
  const { user } = useContext(HouseContext);
  const [listUser,setListUser] = useState([]);
  const [firstname,setFirstname] = useState("");
  const [lastname,setLastname] = useState("");
  const [gender,setGender] = useState();
  const [username,setUsername] = useState();
  const [phone,setPhone] = useState(0);
  const [isEnabled,setIsEnabled] = useState(false);
  const [alertDisabled, setAlertDisabled] = useState(false);
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [updateFail, setUpdateFail] = useState(false);
  
  useEffect(() => {
    const initiate = async () => {
        const userData = await getListUsers();
        if(userData){
            setListUser(userData);
        }
    }
    initiate();
  },[]);

  const closeUpdateFail = () => {
    setUpdateFail(false);
  }

  const closeUpdateSuccess = () => {
    setUpdateSuccess(false);
  }

  const handleEdit = (data) => {
    if (data) {
      setFirstname(data.firstname || "");
      setLastname(data.lastname || "");
      setUsername(data.username || "");
      setPhone(data.phone || "");
      setIsEnabled(data.enabled);
      setGender(data.gender || "");
    }
  };

  const handleDisabled = () => {
    setAlertDisabled(true);
  };

  const handleUpdateUser = async () => {
    if (username && firstname && lastname && phone && gender) {
      const userData = await getUsername(username);
      if (userData) {
        const updateData = {
          id: userData.id,
          username: userData.username,
          password: userData.password,
          roles: userData.roles,
          provider: null,
          email: userData.username,
          roleString: userData.roleString,
          firstname: firstname,
          lastname: lastname,
          phone: phone,
          gender: gender,
          enabled: isEnabled,
        };
        await updateAccount(userData.id, updateData)
          .then((data) => {
            // Cập nhật danh sách người dùng ngay lập tức
            setListUser((prevList) =>
              prevList.map((user) =>
                user.id === userData.id ? { ...user, ...updateData } : user
              )
            );
            setUpdateSuccess(true);
          })
          .catch((error) => {
            console.log("Error", error);
          });
      }
    } else {
      setUpdateFail(true);
    }
  };

  const handleClearForm = () => {
    setFirstname("");
    setLastname("");
    setPhone(0);
    setUsername("");
    setGender("male");
    setIsEnabled(false);
  }

  const handleCancelDisabled = () => {

  };
  const handleDisabledAccount = () => {

  };


  return (
    <main className="flex-1 p-6">
      <div className="">
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2 mt-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                readonly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex items-center space-x-4">
                <RadioGroup className="flex" value={gender}>
                  <RadioGroupItem
                    id="gender-male"
                    name="gender"
                    value="male"
                    onClick={() => setGender("male")}
                  />
                  <Label htmlFor="gender-male">Male</Label>
                  <RadioGroupItem
                    id="gender-female"
                    name="gender"
                    value="female"
                    onClick={() => setGender("female")}
                  />
                  <Label htmlFor="gender-female">Female</Label>
                  <RadioGroupItem
                    id="gender-other"
                    name="gender"
                    value="other"
                    onClick={() => setGender("other")}
                  />
                  <Label htmlFor="gender-other">Other</Label>
                </RadioGroup>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="enabled">Enabled</Label>
              <Switch
                onClick={() => setIsEnabled(!isEnabled)}
                id="enabled"
                checked={isEnabled}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex content-end">
              <Button className=" mx-2" onClick={handleClearForm}>
                Clear Form
              </Button>
              <Button className=" mx-2" onClick={handleUpdateUser}>
                Save Changes
              </Button>
            </div>
          </CardFooter>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 ml-4">All Accounts</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Firstname</TableHead>
                  <TableHead>Lastname</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listUser.map((data, index) => (
                  <TableRow>
                    <TableCell>{data.username}</TableCell>
                    <TableCell>{data.firstname}</TableCell>
                    <TableCell>{data.lastname}</TableCell>
                    <TableCell>{data.gender}</TableCell>
                    <TableCell>{data.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-500 text-green-50"
                      >
                        {data.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <FilePenIcon
                            className="w-4 h-4"
                            onClick={() => handleEdit(data)}
                          />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <TrashIcon
                            className="w-4 h-4"
                            onClick={handleDisabled}
                          />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <AlertDialog open={alertDisabled}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Disabled This Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to disabled this account
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDisabled}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDisabledAccount}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {updateSuccess && (
          <Dialog defaultOpen>
            <DialogContent>
              <Card className="w-full max-w-md mx-auto border-none">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <CircleCheckIcon className="text-green-500 w-12 h-12" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">
                      Update Account Successfully
                    </h2>
                    <p className="text-muted-foreground">
                      you already update this account
                    </p>
                    <Button
                      className="inline-flex h-10 items-center justify-center 
                    rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground 
                    shadow transition-colors hover:bg-primary/90 focus-visible:outline-none 
                    focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      onClick={closeUpdateSuccess}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}
        {updateFail && (
          <Dialog defaultOpen>
            <DialogContent>
              <Card className="w-full max-w-md mx-auto border-none">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <CircleErrorIcon className="text-red-500 w-12 h-12" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Miss infomation</h2>
                    <p className="text-muted-foreground">
                      You need to choose account to change
                    </p>
                  </div>
                  <Button
                    className="inline-flex h-10 items-center justify-center 
                  rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground 
                  shadow transition-colors hover:bg-primary/90 focus-visible:outline-none 
                  focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    onClick={closeUpdateFail}
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </main>
  );
};

export default UserManagement;

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CircleErrorIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
