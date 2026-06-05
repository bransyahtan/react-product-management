import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { logoutUser } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm text-center space-y-6">
        <div className="relative inline-block">
          {user?.image ? (
            <img
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 rounded-full mx-auto border-4 border-zinc-100 dark:border-zinc-800 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <User className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Halo, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Selamat datang di sistem manajemen produk dan inventaris.
          </p>
        </div>

        <div className="pt-4">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}
