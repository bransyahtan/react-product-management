import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Package,
  Tags,
  History,
  LogOut,
  User,
  ShoppingBag,
  ChevronsUpDown,
} from "lucide-react";
import Swal from "sweetalert2";

export function AppSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Produk",
      url: "/products",
      icon: Package,
    },
    {
      title: "Kategori",
      url: "/categories",
      icon: Tags,
    },
    {
      title: "Riwayat",
      url: "/history",
      icon: History,
    },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sesi ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#71717a",
      confirmButtonText: "Ya, Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logoutUser());
        Swal.fire({
          title: "Keluar!",
          text: "Anda telah berhasil keluar.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-zinc-200 dark:border-zinc-800"
    >
      <SidebarHeader className="border-b border-zinc-100 dark:border-zinc-800/50 p-4 group-data-[state=collapsed]:p-2">
        <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-zinc-50 group-data-[state=collapsed]:justify-center">
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className="text-sm group-data-[state=collapsed]:hidden">
            StockManager
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-data-[state=collapsed]:hidden">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`w-full ${
                        isActive
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="group-data-[state=collapsed]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-100 dark:border-zinc-800/50 p-4 group-data-[state=collapsed]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3 min-w-0 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:w-full">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0 group-data-[state=collapsed]:hidden">
                      <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50 truncate">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        Administrator
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 text-zinc-500 group-data-[state=collapsed]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-[200px]"
              >
                <div className="flex items-center gap-2 p-2">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 truncate">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                      admin@stockmanager.com
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 w-full cursor-pointer"
                  >
                    <User className="h-4 w-4" />
                    <span>Profil Saya</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
