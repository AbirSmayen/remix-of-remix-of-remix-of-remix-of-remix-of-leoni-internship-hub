import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg hover:bg-secondary transition-all duration-300 group"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <Sun className={`h-5 w-5 transition-all duration-300 ${theme === "dark" ? "scale-0 rotate-90 opacity-0 absolute" : "scale-100 rotate-0 opacity-100"} text-warning`} />
      <Moon className={`h-5 w-5 transition-all duration-300 ${theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0 absolute"} text-sidebar-primary`} />
    </button>
  );
};

export default ThemeToggle;
