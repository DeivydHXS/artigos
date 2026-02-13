import { Sun, Moon } from "lucide-react";
import useTheme from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md p-2.5 
                 bg-secondary text-secondary-foreground hover:bg-secondary/80 
                 transition-all duration-200 group"
      aria-label="Alternar tema"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
      ) : (
        <Sun className="h-5 w-5 text-terminal-green transition-transform duration-300 group-hover:rotate-60" />
      )}
    </button>
  );
}