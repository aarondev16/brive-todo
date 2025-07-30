import { Calendar, Calendar1 } from "lucide-react";
import type { ComponentProps } from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarRail,
} from "@/components/ui/sidebar";

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

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
