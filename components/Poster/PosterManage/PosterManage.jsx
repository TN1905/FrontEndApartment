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
import { HouseContext } from "../../Apartment/HouseContext";
import { getListApartmentByAccount } from "../../../api/apartments/getListApartmentById";
import { useRouter } from "next/router";
const PosterManage = () => {
  const [apartments, setApartments] = useState([]);
  const { user, editApartment,setEditApartment, isEdit,setEdit } = useContext(HouseContext);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "id", order: "asc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [alertDelete, setAlertDelete] = useState(false);
  const [numbers, setNumbers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteApartment, setDeleteApartment] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const initiate = async () => {
      const apartmentData = await getListApartmentByAccount(user.id);
      setApartments(apartmentData);
    };
    initiate();
  }, [user.id]);

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

  const handleEdit = (apartment) => {
    setEditApartment(apartment);
    router.push("/upload");
  }

  const filterAndPaginate = (searchValue = search, sortValue = sort) => {
    const filteredApartments = apartments
      .filter((apartment) => {
        return (
          apartment.id
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          apartment.content.toLowerCase().includes(searchValue.toLowerCase()) ||
          apartment.apartmentType?.name
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
    const records = filteredApartments.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredApartments.length / itemsPerPage);
    const numbers = [...Array(npage).keys()].map((i) => i + 1);
    setNumbers(numbers);
    setRecords(records);
  };

  useEffect(() => {
    filterAndPaginate();
  }, [currentPage, itemsPerPage, apartments]);

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
    <div className="w-full h-[90vh] items-center justify-center">
      <main id="main" className="main">
        <h1 className="text-2xl font-bold">Quản lý đăng tin</h1>
        <div className="mb-6 flex flex-wrap -mx-2 mt-4">
          <div className="flex flex-col gap-4">
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
                      value="content"
                      onClick={() => handleSort("content")}
                    >
                      Content
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="price"
                      onClick={() => handleSort("price")}
                    >
                      Price
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
                    <TableHead>Content</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Acreage</TableHead>
                    <TableHead>Price (Đ/month)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records?.map((apartment, index) => (
                    <TableRow key={index}>
                      <TableCell>{apartment.id}</TableCell>
                      <TableCell>{apartment.content}</TableCell>
                      <TableCell>{apartment.city}</TableCell>
                      <TableCell>{apartment.apartmentType?.name}</TableCell>
                      <TableCell>{apartment.acreage}</TableCell>
                      <TableCell>{apartment.price}</TableCell>
                      <TableCell>
                        <Badge className="">{apartment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(apartment)}
                          >
                            <FilePenIcon className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(apartment)}
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
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
    </div>
  );
};

export default PosterManage;

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
