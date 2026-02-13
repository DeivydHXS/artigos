import { useState, useEffect } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        const localTheme = localStorage.getItem("theme");
        if (localTheme) return localTheme;

        return window.matchMedia("(prefers-color-scheme: light)").matches
            ? "dark"
            : "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(theme === "dark" ? "light" : "dark");

        root.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme };
}