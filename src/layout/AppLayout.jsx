import { Footer } from "../components/common/Footer";
import { Header } from "../components/common/Header";
import { AppSidebar } from "../components/common/AppSidebar";
import { AppRouters } from "../routes/route";
import { useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export const AppLayout = () => {
  const location = useLocation();
  const hideHeaderFooter = ["/", "/login"].includes(location.pathname);

  if (hideHeaderFooter) {
    return (
      <main className="w-full">
        <AppRouters />
      </main>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="grow p-6">
              <AppRouters />
            </main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};
