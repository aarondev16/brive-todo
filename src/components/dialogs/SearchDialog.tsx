import { Loader2, Search as SearchIcon } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { TaskItem } from "@/components/TaskItem.tsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useGetTasks } from "@/hooks/useTask";

export const SearchDialog: FC = () => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query?.trim());
		}, 100);
		return () => clearTimeout(handler);
	}, [query]);

	const { data: tasks = [], isPending } = useGetTasks({
		search: debouncedQuery,
		enabled: debouncedQuery.length > 0,
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<SidebarMenuButton>
					<SearchIcon />
					Buscar
				</SidebarMenuButton>
			</DialogTrigger>

			<DialogContent className="w-full max-w-md ">
				<div className="flex items-center gap-2 mt-4">
					<SearchIcon className="text-muted-foreground" />
					<Input
						autoFocus
						placeholder="Buscar tareas..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="!bg-transparent flex-1 border-none text-lg focus:ring-0"
					/>
				</div>

				<div className=" h-60 space-y-2 overflow-y-auto pr-4">
					{debouncedQuery === "" ? (
						<p className="text-center text-muted-foreground text-sm">
							Escribe para buscar tareas...
						</p>
					) : isPending ? (
						<div className="flex h-full items-center justify-center">
							<Loader2 className="animate-spin" />
						</div>
					) : tasks.length === 0 ? (
						<p className="text-center text-muted-foreground text-sm">
							No se encontraron tareas.
						</p>
					) : (
						tasks.map((task) => <TaskItem key={task.id} task={task} />)
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
