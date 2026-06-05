import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";

export const Home = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-[80vh] flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Sistem Manajemen Produk & Inventaris Modern
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Kelola stok barang, pantau status produk, dan tingkatkan efisiensi operasional bisnis Anda melalui satu platform terintegrasi.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          {token ? (
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Back To Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};
