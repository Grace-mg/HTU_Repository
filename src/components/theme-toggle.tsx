"use client";

import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { applyTheme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-full cursor-pointer hover:bg-accent transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-500 transition-all" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transition-all" />
      )}
    </Button>
  );
}
