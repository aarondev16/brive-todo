import { createFileRoute } from "@tanstack/react-router";
import { isAuthenticated } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
	loader: async () => {
		if (isAuthenticated()) {
			window.location.href = "/app";
		}
	},
});
