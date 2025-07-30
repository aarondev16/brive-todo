import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAuthenticated } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		if (isAuthenticated()) {
			throw redirect({
				to: "/app",
			});
		} else {
			throw redirect({
				to: "/auth/login",
			});
		}
	},
});
