import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/context/ThemeContextProvider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

function Root() {
	return (
		<ThemeProvider>
			<div className="px-4">
				<Outlet />
			</div>
			<Toaster />
		</ThemeProvider>
	);
}
export const Route = createRootRoute({
	component: Root,
});
