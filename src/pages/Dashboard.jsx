import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchProducts, addProduct } from "@/store/products";
import Swal from "sweetalert2";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const LIMIT = 20;

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { products, total, isLoading, error } = useSelector(
    (state) => state.products,
  );

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const totalPages = Math.ceil(total / LIMIT);

  const handleSearch = () => {
    setPage(1);
    setActiveQuery(query);
  };

  const handleAddProduct = () => {
    Swal.fire({
      title: "Add New Product",
      html: `
        <div class="space-y-4 text-left p-2">
          <div>
            <label class="block text-xs font-semibold text-zinc-500 mb-1 dark:text-zinc-300">Product Title</label>
            <input id="swal-title" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" placeholder="e.g. BMW Pencil">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Brand</label>
            <input id="swal-brand" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" placeholder="e.g. BMW">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Category</label>
            <input id="swal-category" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" placeholder="e.g. office-supplies">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Price ($)</label>
              <input id="swal-price" type="number" step="0.01" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" placeholder="e.g. 9.99">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Stock</label>
              <input id="swal-stock" type="number" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" placeholder="e.g. 50">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add Product",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#18181b",
      cancelButtonColor: "#71717a",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const brand = document.getElementById("swal-brand").value;
        const category = document.getElementById("swal-category").value;
        const price = parseFloat(document.getElementById("swal-price").value);
        const stock = parseInt(document.getElementById("swal-stock").value);

        if (!title.trim()) {
          Swal.showValidationMessage("Title is required");
          return false;
        }
        if (!category.trim()) {
          Swal.showValidationMessage("Category is required");
          return false;
        }
        if (isNaN(price) || price < 0) {
          Swal.showValidationMessage("Please enter a valid price");
          return false;
        }
        if (isNaN(stock) || stock < 0) {
          Swal.showValidationMessage("Please enter a valid stock amount");
          return false;
        }

        return {
          title,
          brand,
          category,
          price,
          stock,
          thumbnail: "https://dummyjson.com/image/150",
          rating: 0,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Adding product...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await dispatch(addProduct(result.value)).unwrap();
          Swal.fire({
            title: "Added!",
            text: "New product has been successfully added.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text: err || "Failed to add new product.",
            icon: "error",
          });
        }
      }
    });
  };

  useEffect(() => {
    if (!token) return;
    dispatch(
      fetchProducts({ limit: LIMIT, skip: (page - 1) * LIMIT, q: activeQuery }),
    );
  }, [dispatch, token, page, activeQuery]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Hello, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Here is the list of available products.
          </p>
        </div>
        <Button
          onClick={handleAddProduct}
          className="shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="space-y-1.5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 pr-20"
          />
          <button
            onClick={handleSearch}
            className="cursor-pointer absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-md bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Search
          </button>
        </div>
        {activeQuery && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-1">
            {total} result{total !== 1 ? "s" : ""} for &ldquo;{activeQuery}
            &rdquo;
          </p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50 dark:bg-zinc-800/50">
              <TableHead className="w-10">#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center w-32">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: LIMIT }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-6" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20 mx-auto rounded-md" />
                    </TableCell>
                  </TableRow>
                ))
              : products.map((product, index) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  >
                    <TableCell className="text-zinc-400 text-xs">
                      {(page - 1) * LIMIT + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-10 w-10 rounded-lg object-cover border border-zinc-100 dark:border-zinc-800"
                        />
                        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {product.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-zinc-500 dark:text-zinc-400">
                      ⭐ {product.rating}
                    </TableCell>
                    <TableCell className="text-center text-sm text-zinc-900 dark:text-zinc-100">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-3 cursor-pointer"
                        onClick={() =>
                          navigate(`/dashboard/product/${product.id}`)
                        }
                      >
                        View Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
