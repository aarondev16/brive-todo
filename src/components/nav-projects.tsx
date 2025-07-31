import { Link, useNavigate } from "@tanstack/react-router";
import { Hash, Trash } from "lucide-react";
import { useState } from "react";
import CreateProject from "@/components/dialogs/CreateProject.tsx";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDeleteProject, useGetProjects } from "@/hooks/useProject";

export function NavProjects() {
	const navigate = useNavigate();

	const { data: projects } = useGetProjects();
	const { mutate: deleteProject } = useDeleteProject();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [selected, setSelected] = useState<{ id: string; name: string } | null>(
		null,
	);

	const openConfirm = (project: { id: string; name: string }) => {
		setSelected(project);
		setDialogOpen(true);
	};

	const confirmDelete = () => {
		if (selected) {
			deleteProject({ id: selected.id });
		}
		setDialogOpen(false);
		setSelected(null);
		navigate({
			to: "/app/today",
		});
	};

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className="flex justify-between">
				Proyectos
				<CreateProject />
			</SidebarGroupLabel>
			<SidebarMenu>
				{projects.map((item) => (
					<SidebarMenuItem key={item.id} className="flex items-center">
						<SidebarMenuButton asChild>
							<Link
								to={"/app/project/$id"}
								params={{ id: item.id }}
								className="flex items-center gap-x-1"
							>
								<Hash className="size-4" />
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
						<SidebarMenuAction showOnHover>
							<AlertDialog
								open={dialogOpen && selected?.id === item.id}
								onOpenChange={(open) => {
									setDialogOpen(open);
									if (!open) setSelected(null);
								}}
							>
								<AlertDialogTrigger asChild>
									<button type="button" onClick={() => openConfirm(item)}>
										<Trash className="size-4" />
									</button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											¿Eliminar proyecto {item.name}?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Esta acción no se puede deshacer. <br /> El proyecto se
											eliminará permanentemente junto a sus tareas.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancelar</AlertDialogCancel>
										<AlertDialogAction
											onClick={confirmDelete}
											className="bg-red-600 text-white"
										>
											Eliminar
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</SidebarMenuAction>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
