import React, { useContext } from "react";
import { useRouter } from 'next/router';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HouseContext } from "../../Apartment/HouseContext";

const AxpiredApartmentPage = ({ loadRentApartments }) => {
    const { setSelectedRental, user } = useContext(HouseContext);
    const expiredApartments = loadRentApartments.filter(
        rental => rental.status === "RENTED" && rental.apartment.status === "RENTED" && rental.apartment.account.id === user.id);
    const router = useRouter();

    const handleRepost = (rental) => {
        setSelectedRental(rental);
        router.push({
            pathname: '/reportapartment',
        });
    };

    return (
        <main className="flex-1 p-6">
            <div>
                <h2 className="mb-4 text-2xl font-bold">Expired Rental</h2>
                <Card>
                    <CardContent>
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
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expiredApartments.map((rental) => (
                                    <TableRow key={rental.apartment.id}>
                                        <TableCell>{rental.apartment.id}</TableCell>
                                        <TableCell>{rental.id}</TableCell>
                                        <TableCell>{rental.apartment.address}</TableCell>
                                        <TableCell>{rental.apartment.content}</TableCell>
                                        <TableCell>{rental.apartment.price.toLocaleString()} VND</TableCell>
                                        <TableCell>{rental.apartment.acreage} m²</TableCell>
                                        <TableCell>{rental.apartment.city}</TableCell>
                                        <TableCell>{rental.apartment.district}</TableCell>
                                        <TableCell>{rental.apartment.ward}</TableCell>
                                        <TableCell>{rental.apartment.apartmentType.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-red-500 text-green-50">
                                                {rental.apartment.status ? "Expired" : "Available"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" className="ml-2" onClick={() => handleRepost(rental)}>
                                                Repost
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default AxpiredApartmentPage;