import React, { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { HouseContext } from "../Apartment/HouseContext";
import { useRouter } from "next/router";
import { getAllTranSaction } from "../../api/walletTransaction/getAllTransaction";
import { Label } from "@/components/ui/label";
const Transaction = () => {
  const { user, editApartment, setEditApartment, isEdit, setEdit, wallet } =
    useContext(HouseContext);
  const [transactionData, setTransactionData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "id", order: "asc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [alertDelete, setAlertDelete] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteApartment, setDeleteApartment] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transData = await getAllTranSaction();
        console.log("API Response:", transData);
        if (Array.isArray(transData)) {
          setTransactionData(transData);
        } else {
          console.error("API did not return an array:", transData);
          setTransactionData([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactionData([]);
      }
    };

    fetchTransactions();
  }, [wallet]);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    filterAndPaginate(value, sort);
  };

  const changePage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== numbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filterAndPaginate = (searchValue = search, sortValue = sort) => {
    const filteredTransaction = transactionData
      .filter((trans) => {
        return (
          trans.id
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          trans.receiver.toLowerCase().includes(searchValue.toLowerCase()) ||
          trans.receiver_payment_number
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortValue.order === "asc") {
          return a[sortValue.key] > b[sortValue.key] ? 1 : -1;
        } else {
          return a[sortValue.key] < b[sortValue.key] ? 1 : -1;
        }
      });

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const records = filteredTransaction.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredTransaction.length / itemsPerPage);
    const numbers = [...Array(npage).keys()].map((i) => i + 1);
    setNumbers(numbers);
    setRecords(records);
  };

  useEffect(() => {
    filterAndPaginate();
  }, [currentPage, itemsPerPage, transactionData]);

  const handleSort = (key) => {
    const order = sort.key === key && sort.order === "asc" ? "desc" : "asc";
    setSort({ key, order });
    filterAndPaginate(search, { key, order });
  };

  const handleDelete = (apartment) => {
    setDeleteApartment(apartment);
    setAlertDelete(true);
  };

  const handleConfirmDelete = () => {
    // Logic to delete apartment
    setDeleteApartment(null);
    setAlertDelete(false);
  };

  const handleCancelDelete = () => {
    setAlertDelete(false);
  };

  return (
    <main className="flex-1 p-6">
      <main id="main" className="main">
        <h1 className="text-2xl font-bold">Lịch sử giao dịch</h1>
        <div className="mb-6 flex flex-wrap -mx-2 mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4 w-[30%]">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${errors.startDate ? "border-red-500" : ""}`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEnddATE(e.target.value)}
                className={`${errors.endDate ? "border-red-500" : ""}`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search apartments..."
                  className="w-full rounded-lg bg-background pl-8"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                    <ArrowUpDownIcon className="h-4 w-4 mr-2" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] bg-white" align="end">
                  <DropdownMenuRadioGroup value={sort.key}>
                    <DropdownMenuRadioItem
                      value="id"
                      onClick={() => handleSort("id")}
                    >
                      ID
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="amount"
                      onClick={() => handleSort("amount")}
                    >
                      Amount
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="createdate"
                      onClick={() => handleSort("createdate")}
                    >
                      Date
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioItem
                    value={sort.order}
                    onClick={() => handleSort(sort.key)}
                  >
                    {sort.order === "asc" ? "Ascending" : "Descending"}
                  </DropdownMenuRadioItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type Transaction</TableHead>
                    <TableHead>Number Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records?.map((trans, index) => (
                    <TableRow key={index}>
                      <TableCell>{trans.id}</TableCell>
                      <TableCell>{trans.receiver}</TableCell>
                      <TableCell>
                        {trans.amount.toLocaleString("vi-VN")}
                      </TableCell>
                      <TableCell>{trans.localDateTime}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            trans.transactionType === "RENTED"
                              ? "bg-blue-500"
                              : trans.transactionType === "DEPOSITE"
                              ? "bg-green-500"
                              : trans.transactionType === "COMMISSION"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        >
                          {trans.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell>{trans.receiver_payment_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <AlertDialog open={alertDelete}>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Apartment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete the apartment "
                    {deleteApartment?.name}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleCancelDelete}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex items-center justify-end gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={prePage}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {numbers.map((n, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => changePage(n)}
                        isActive={currentPage === n}
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={nextPage}
                      disabled={currentPage === numbers.length}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-5 text-sm transition-all duration-300 border-t border-[#cddfff] text-center">
        <div className="items-center text-[#012970]">
          &copy; Copyrights
          <strong>
            <span> Poster</span>
          </strong>
          . All Rights Reserved
        </div>
      </footer>
    </main>
  );
};

export default Transaction;

function ArrowUpDownIcon(props) {
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
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}

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

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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
