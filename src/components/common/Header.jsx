import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Panel Admin
        </span>
      </div>
    </header>
  );
};
