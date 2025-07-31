import { Plus } from "lucide-react";
import { type FC, useState } from "react";
import { TaskDatePicker } from "@/components/calendar-19.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";
import { useGetProjects } from "@/hooks/useProject.ts";
import { useCreateTaskModal } from "@/hooks/useTask.ts";

export const AddTaskDialog: FC = () => {
	const { mutate: createTask, isPending } = useCreateTaskModal();
	const { data: projects } = useGetProjects();
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [longDescription, setLongDescription] = useState("");
	const [deadline, setDeadline] = useState<string | null>(null);
	const [project, setProject] = useState<string | null>(null);

	const reset = () => {
		setTitle("");
		setLongDescription("");
		setDeadline(null);
		setProject(null);
	};

	const handleCreateTask = () => {
		if (!title?.trim()) return;

		createTask(
			{
				description: title?.trim(),
				longDescription: longDescription ?? undefined,
				deadline: deadline ?? undefined,
				projectId: project ?? undefined,
			},
			{
				onSuccess: () => {
					reset();
					setOpen(false);
				},
			},
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (!v) reset();
			}}
		>
			<DialogTrigger asChild>
				<SidebarMenuButton>
					<Plus className="text-primary" />
					Añadir tarea
				</SidebarMenuButton>
			</DialogTrigger>
			<DialogContent className="space-y-4 p-4">
				<DialogHeader>
					<DialogTitle>Crear una tarea</DialogTitle>
					<DialogDescription>
						Crear una nueva tarea para el proyecto seleccionado.
					</DialogDescription>
				</DialogHeader>
				<Input
					autoFocus
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Nombre de la tarea"
					className="border-none bg-transparent text-2xl shadow-none focus:ring-0"
				/>
				<Input
					value={longDescription}
					onChange={(e) => setLongDescription(e.target.value)}
					placeholder="Descripción de la tarea"
					className="border-none bg-transparent text-2xl shadow-none focus:ring-0"
				/>

				<div className="flex flex-col gap-2 sm:flex-row">
					<TaskDatePicker value={deadline} onChange={setDeadline} />
					{projects && projects.length > 0 && (
						<Select
							value={project ?? undefined}
							onValueChange={(v) => setProject(v)}
						>
							<SelectTrigger className="min-w-[180px]">
								<SelectValue placeholder="Proyecto" />
							</SelectTrigger>
							<SelectContent>
								{projects?.map((p) => (
									<SelectItem key={p.id} value={p.id}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>

				<DialogFooter>
					<Button
						disabled={!title?.trim() || isPending}
						onClick={handleCreateTask}
					>
						Añadir
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
