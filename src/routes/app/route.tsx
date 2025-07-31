import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Calendar, Calendar1 } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { isAuthenticated } from "@/hooks/useAuth";

export const Route = createFileRoute("/app")({
	component: RouteComponent,
	loader: async () => {
		if (!isAuthenticated()) {
			window.location.href = "/auth/login";
		}
	},
});

const data = {
	user: {
		name: "Aaron",
		email: "aaronoso0704@gmail.com",
	},
	navMain: [
		{
			title: "Hoy",
			url: "today",
			icon: Calendar,
		},
		{
			title: "Próximo",
			url: "upcoming",
			icon: Calendar1,
		},
	],
};

function RouteComponent() {
	return (
		<SidebarProvider open={true}>
			<Sidebar collapsible="icon">
				<SidebarFooter>
					<NavUser user={data.user} />
				</SidebarFooter>
				<SidebarContent>
					<NavMain items={data.navMain} />
					<NavProjects />
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
					</div>
				</header>
				<div className="flex justify-center">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
