import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "@/api/axiosInstance";
import { updateProduct, deleteProduct } from "@/store/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Calendar,
  User,
  Scale,
  Maximize2,
  Edit,
  Trash,
} from "lucide-react";
import Swal from "sweetalert2";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setActiveImage(response.data.images[0]);
        } else {
          setActiveImage(response.data.thumbnail);
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load product details",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, token, navigate]);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#71717a",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Deleting...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await dispatch(deleteProduct(id)).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Product has been successfully deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            navigate("/dashboard");
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text:
              err.response?.data?.message ||
              err.message ||
              "Failed to delete the product.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleEdit = () => {
    Swal.fire({
      title: "Edit Product",
      html: `
        <div class="space-y-4 text-left p-2">
          <div>
            <label class="block text-xs font-semibold text-zinc-500 mb-1 dark:text-zinc-300">Product Title</label>
            <input id="swal-title" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" value="${product.title.replace(/"/g, "&quot;")}">
          </div>
          <div>
            <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Brand</label>
            <input id="swal-brand" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" value="${(product.brand || "").replace(/"/g, "&quot;")}">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Price ($)</label>
              <input id="swal-price" type="number" step="0.01" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" value="${product.price}">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-zinc-700 dark:text-zinc-300">Stock</label>
              <input id="swal-stock" type="number" class="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50" value="${product.stock}">
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#18181b",
      cancelButtonColor: "#71717a",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const brand = document.getElementById("swal-brand").value;
        const price = parseFloat(document.getElementById("swal-price").value);
        const stock = parseInt(document.getElementById("swal-stock").value);

        if (!title.trim()) {
          Swal.showValidationMessage("Title is required");
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

        return { title, brand, price, stock };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Saving changes...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          const updatedProduct = await dispatch(
            updateProduct({ id, productData: result.value }),
          ).unwrap();
          setProduct(updatedProduct);
          Swal.fire({
            title: "Saved!",
            text: "Product details updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text:
              err.response?.data?.message ||
              err.message ||
              "Failed to update product.",
            icon: "error",
          });
        }
      }
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0"
          />,
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative inline-block h-4 w-4">
            <Star className="absolute top-0 left-0 h-4 w-4 text-zinc-300 dark:text-zinc-700" />
            <div className="absolute top-0 left-0 h-4 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </div>
          </div>,
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="h-4 w-4 text-zinc-300 dark:text-zinc-700 shrink-0"
          />,
        );
      }
    }
    return stars;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
            Error Loading Product
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {error}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-2">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <Skeleton className="h-16 w-16 rounded-lg" />
              <Skeleton className="h-16 w-16 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center gap-1.5 cursor-pointer text-xs h-8 px-3"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit Product
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1.5 cursor-pointer text-xs h-8 px-3"
          >
            <Trash className="h-3.5 w-3.5" />
            Delete Product
          </Button>
          <span className="text-xs text-zinc-400 font-mono sm:ml-2">
            ID: {product.id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 shadow-xs relative">
            <img
              src={activeImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain rounded-xl"
            />
            {product.discountPercentage > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1"
              >
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 rounded-xl border-2 shrink-0 overflow-hidden bg-white dark:bg-zinc-900 p-1 transition-all ${
                    activeImage === img
                      ? "border-zinc-900 dark:border-zinc-50 ring-2 ring-zinc-900/10 dark:ring-zinc-50/10"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize text-xs">
                {product.category}
              </Badge>
              {product.brand && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  {product.brand}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {product.rating.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                ({product.reviews?.length || 0} customer reviews)
              </span>
            </div>
          </div>
          <Separator className="bg-zinc-200 dark:bg-zinc-800" />
          <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-lg text-zinc-400 dark:text-zinc-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {product.stock} items remaining
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Description
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/20">
            <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                Brand
              </div>
              <div className="p-3 text-xs text-zinc-900 dark:text-zinc-100 font-medium">
                {product.brand || "N/A"}
              </div>
            </div>
            <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                SKU
              </div>
              <div className="p-3 text-xs text-zinc-900 dark:text-zinc-100 font-mono">
                {product.sku || "N/A"}
              </div>
            </div>
            {product.dimensions && (
              <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-1.5">
                  <Maximize2 className="h-3 w-3 text-zinc-400" />
                  Dimensions
                </div>
                <div className="p-3 text-xs text-zinc-900 dark:text-zinc-100 font-medium">
                  {product.dimensions.width} &times; {product.dimensions.height}{" "}
                  &times; {product.dimensions.depth} cm
                </div>
              </div>
            )}
            {product.weight && (
              <div className="grid grid-cols-2">
                <div className="p-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center gap-1.5">
                  <Scale className="h-3 w-3 text-zinc-400" />
                  Weight
                </div>
                <div className="p-3 text-xs text-zinc-900 dark:text-zinc-100 font-medium">
                  {product.weight} kg
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/20">
              <ShieldCheck className="h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Warranty Information
                </p>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {product.warrantyInformation || "No warranty info available"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/20">
              <Truck className="h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Shipping Information
                </p>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {product.shippingInformation || "Standard shipping available"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/20">
              <RotateCcw className="h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Return Policy
                </p>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {product.returnPolicy || "Standard return terms"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/20">
              <ShoppingCart className="h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Min. Order Quantity
                </p>
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {product.minimumOrderQuantity || 1} unit
                  {product.minimumOrderQuantity > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="bg-zinc-200 dark:bg-zinc-800 my-8" />
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Customer Reviews
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real feedback from verified purchasers
          </p>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev, index) => (
              <div
                key={index}
                className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/30 flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        {rev.reviewerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(rev.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic pl-1">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 pl-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {new Date(rev.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900/20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm text-zinc-500 dark:text-zinc-400">
            No reviews yet for this product.
          </div>
        )}
      </div>
    </div>
  );
}
