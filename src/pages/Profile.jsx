import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchProfile } from "@/store/profile";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { profileData, isLoading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!token) return;
    dispatch(fetchProfile());
  }, [token, dispatch]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Profil Saya</h1>

      {isLoading ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : profileData ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={profileData.image}
              alt={profileData.firstName}
              className="w-16 h-16 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {profileData.firstName} {profileData.lastName}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">@{profileData.username}</p>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-500">Email</span>
              <span className="text-zinc-900 dark:text-zinc-100">{profileData.email}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-500">Jenis Kelamin</span>
              <span className="capitalize text-zinc-900 dark:text-zinc-100">{profileData.gender}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-zinc-500">ID Pengguna</span>
              <span className="text-zinc-900 dark:text-zinc-100">{profileData.id}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
