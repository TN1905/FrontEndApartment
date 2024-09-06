import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, } from "@/components/ui/table";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getPendingApartments } from '../../api/approveapartment/getPendingApartments';
import { approveApartment } from '../../api/approveapartment/approveApartment';
import { rejectApartment } from '../../api/approveapartment/rejectApartment';

const AdminApprovalPage = () => {
  const [pendingApartments, setPendingApartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPendingApartments();
      setPendingApartments(data);
    };
    fetchData();
  }, []);

  const handleApprove = async (apartmentId) => {
    try {
      await approveApartment(apartmentId);
      setPendingApartments((prev) => prev.filter(apartment => apartment.id !== apartmentId));
    } catch (error) {
      console.error("Failed to approve apartment:", error.message);
      alert("Failed to approve apartment: " + error.message);
    }
  };

  const handleReject = async (apartmentId) => {
    try {
      await rejectApartment(apartmentId);
      setPendingApartments((prev) => prev.filter(apartment => apartment.id !== apartmentId));
    } catch (error) {
      console.error("Failed to reject apartment:", error.message);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Apartment ID</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>City</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Ward</TableHead>
              <TableHead>Apartment Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApartments.map((apartment) => (
              <TableRow key={apartment.id}>
                <TableCell>{apartment.id}</TableCell>
                <TableCell>{apartment.address}</TableCell>
                <TableCell>{apartment.content}</TableCell>
                <TableCell>{apartment.price}</TableCell>
                <TableCell>{apartment.acreage}</TableCell>
                <TableCell>{apartment.city}</TableCell>
                <TableCell>{apartment.district}</TableCell>
                <TableCell>{apartment.ward}</TableCell>
                <TableCell>{apartment.apartmentType.name}</TableCell>
                <TableCell className="space-x-2 text-right flex">
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
                        <AlertDialogTitle>Approve Apartment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve this apartment to be posted?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleApprove(apartment.id)}>
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
                        <AlertDialogTitle>Refuse APartment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject this apartment to be posted?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleReject(apartment.id)}
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

export default AdminApprovalPage;
