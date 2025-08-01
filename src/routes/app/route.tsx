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
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { isAuthenticated } from "@/hooks/useAuth";

const NAV_ITEMS = [
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
];

function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarFooter>
				<NavUser  />
			</SidebarFooter>
			<SidebarContent>
				<NavMain items={NAV_ITEMS} />
				<NavProjects />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}

function AppHeader() {
	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
			</div>
		</header>
	);
}

function RouteComponent() {
	return (
		<SidebarProvider open={true}>
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<div className="flex justify-center">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export const Route = createFileRoute("/app")({
	component: RouteComponent,
	loader: async () => {
		if (!isAuthenticated()) {
			window.location.href = "/auth/login";
		}
	},
});
