import { Monitor, Moon, Sun } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./context/ThemeContextProvider.tsx";

const ThemeToggle: FC = () => {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => {
				if (theme === "light") setTheme("dark");
				else if (theme === "dark") setTheme("system");
				else setTheme("light");
			}}
		>
			{theme === "light" && <Sun className="h-4 w-4" />}
			{theme === "dark" && <Moon className="h-4 w-4" />}
			{theme === "system" && <Monitor className="h-4 w-4" />}
		</Button>
	);
};

export default ThemeToggle;
