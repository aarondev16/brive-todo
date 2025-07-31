import { Link } from "@tanstack/react-router";
import { Inbox, type LucideIcon } from "lucide-react";
import { AddTaskDialog } from "@/components/dialogs/AddTaskDialog.tsx";
import { SearchDialog } from "@/components/dialogs/SearchDialog.tsx";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				<AddTaskDialog />
				<SearchDialog />
				<SidebarMenuButton asChild>
					<Link to="/app/inbox">
						<Inbox />
						Bandeja
					</Link>
				</SidebarMenuButton>
				{items.map((item) => (
					<SidebarMenuButton key={item.title} tooltip={item.title} asChild>
						<Link to={item.url}>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
						</Link>
					</SidebarMenuButton>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
