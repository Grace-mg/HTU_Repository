export type ThemeMode = "light" | "dark" | "system";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" && getSystemTheme() === "dark");

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Update theme-color meta tags for mobile safe-area / status-bar
  const themeColor = isDark ? "#030712" : "#f8fafc";
  const metaTags = document.querySelectorAll('meta[name="theme-color"]');
  if (metaTags.length > 0) {
    metaTags.forEach((meta) => {
      meta.setAttribute("content", themeColor);
      meta.removeAttribute("media");
    });
  } else {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", themeColor);
    document.head.appendChild(meta);
  }

  // Update iOS status bar style meta tag
  const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (appleMeta) {
    appleMeta.setAttribute("content", isDark ? "black-translucent" : "default");
  }
}
