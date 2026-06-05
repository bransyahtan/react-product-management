import React from "react";

export const Footer = () => {
  return (
    <footer className="p-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 bg-white dark:bg-zinc-900 transition-colors">
      © {new Date().getFullYear()} StockManager. All rights reserved.
    </footer>
  );
};
