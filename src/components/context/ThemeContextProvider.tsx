import {
	createContext,
	type ReactNode,
	useContext,
	useLayoutEffect,
	useState,
} from "react";

// Tipos para el tema
type Theme = "light" | "dark";
type ThemeOption = Theme | "system";

interface ThemeContextType {
	theme: ThemeOption;
	setTheme: (theme: ThemeOption) => void;
}

// Función para obtener el tema del sistema
const getSystemTheme = (): Theme => {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
};

// Función para aplicar el tema al documento
const applyTheme = (theme: Theme): void => {
	if (typeof document === "undefined") return;

	document.documentElement.classList.toggle("dark", theme === "dark");
	document.documentElement.setAttribute("data-theme", theme);
};

// Función para obtener el tema guardado
const getSavedTheme = (): ThemeOption => {
	if (typeof localStorage === "undefined") return "system";
	return (localStorage.getItem("theme") as ThemeOption) || "system";
};

// Función para guardar el tema
const saveTheme = (themeOption: ThemeOption): void => {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem("theme", themeOption);
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<ThemeOption>(() => {
		const saved = getSavedTheme();
		const actualTheme =
			saved === "system" ? getSystemTheme() : (saved as Theme);

		applyTheme(actualTheme);

		return saved;
	});

	// Función para actualizar el tema
	const setTheme = (newTheme: ThemeOption): void => {
		const actualTheme =
			newTheme === "system" ? getSystemTheme() : (newTheme as Theme);
		applyTheme(actualTheme);
		saveTheme(newTheme);
		setThemeState(newTheme);
	};

	// Efecto para escuchar cambios en el tema del sistema
	useLayoutEffect(() => {
		if (typeof window === "undefined") return;

		const handleSystemChange = (e: MediaQueryListEvent): void => {
			if (theme !== "system") return;

			const newTheme: Theme = e.matches ? "dark" : "light";
			applyTheme(newTheme);
		};

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Usar la API moderna si está disponible
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleSystemChange);
			return () => mediaQuery.removeEventListener("change", handleSystemChange);
		} else {
			// Fallback para navegadores más antiguos
			mediaQuery.addListener(handleSystemChange);
			return () => mediaQuery.removeListener(handleSystemChange);
		}
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
