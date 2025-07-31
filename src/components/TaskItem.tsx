import { addDays, format } from "date-fns";
import { CalendarIcon, TrashIcon } from "lucide-react";
import { type FC, memo, useCallback, useMemo, useState } from "react";
import { TaskDatePicker } from "@/components/calendar-19.tsx";
import { formatDeadline, today } from "@/components/TaskList.tsx";
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
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTask.ts";
import type { Task } from "@/types/task.ts";

export const TaskItem: FC<{ task: Task }> = memo(({ task }) => {
	const { mutate: update, isPending } = useUpdateTask(task.id);
	const { mutate: deleteTask } = useDeleteTask(task.id);

	const [description, setDescription] = useState(task.description);
	const [longDescription, setLongDescription] = useState(task.longDescription);
	const [deadline, setDeadline] = useState<string | null>(
		task.deadline ?? null,
	);
	const [status, setStatus] = useState<Task["status"]>(task.status);
	const [open, setOpen] = useState(false);
	const [isDateOpen, setIsDateOpen] = useState(false);

	const [confirmOpen, setConfirmOpen] = useState(false);

	const patch = useCallback((body: Partial<Task>) => update(body), [update]);

	const handleToggleCompleted = useCallback(
		(checked: boolean) => {
			const newStatus: Task["status"] = checked ? "completed" : "pending";
			setStatus(newStatus);
			patch({ status: newStatus });
		},
		[patch],
	);

	const moveDeadline = useCallback(
		(days: number) => {
			const newDate = format(addDays(today, days), "yyyy-MM-dd");
			setDeadline(newDate);
			patch({ deadline: newDate });
		},
		[patch],
	);

	const saveChanges = useCallback(() => {
		patch({
			description: description.trim(),
			longDescription: longDescription.trim(),
			status,
			deadline: deadline ?? undefined,
		});
		setOpen(false);
	}, [description, longDescription, status, deadline, patch]);

	const handleDeadlineChange = useCallback(
		(date: string | null) => {
			setDeadline(date);
			patch({ deadline: date ?? undefined });
		},
		[patch],
	);

	const openConfirm = useCallback(() => setConfirmOpen(true), []);
	const closeConfirm = useCallback(() => setConfirmOpen(false), []);
	const confirmDelete = useCallback(() => {
		deleteTask();
		closeConfirm();
	}, [deleteTask, closeConfirm]);

	const statusText = useMemo(() => {
		switch (status) {
			case "completed":
				return "Completada";
			case "in-progress":
				return "En progreso";
			case "cancelled":
				return "Cancelada";
			default:
				return "Pendiente";
		}
	}, [status]);

	const { mutate: updateStatus, isPending: updateStatusPending } =
		useUpdateTask(task.id);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="group flex w-full items-start justify-between gap-3 border-border border-b py-3">
				<Checkbox
					checked={status === "completed"}
					onCheckedChange={handleToggleCompleted}
					onClick={(e) => e.stopPropagation()}
					className="mt-1 size-5 rounded-full"
				/>

				<button
					type="button"
					className="flex-1 cursor-pointer text-start"
					onClick={() => setOpen(true)}
				>
					<p
						className={
							status === "cancelled" ? "text-muted-foreground line-through" : ""
						}
					>
						{description}
					</p>
					{longDescription && (
						<p className="text-muted-foreground text-sm">{longDescription}</p>
					)}
					{deadline && (
						<span className="text-primary text-xs">
							{formatDeadline(deadline)}
						</span>
					)}
				</button>

				<div className="flex items-center gap-1">
					<Select
						value={task.status}
						onValueChange={(value) =>
							updateStatus({ status: value as Task["status"] })
						}
						disabled={updateStatusPending}
					>
						<SelectTrigger className="max-w-32">
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent className="">
							<SelectItem value="pending">Pendiente</SelectItem>
							<SelectItem value="in-progress">En progreso</SelectItem>
							<SelectItem value="cancelled">Cancelada</SelectItem>
						</SelectContent>
					</Select>
					{/*{status !== "completed" && (*/}
					{/*	<Button variant="ghost" size="icon" onClick={toggleProgress}>*/}
					{/*		{status === "in-progress" ? (*/}
					{/*			<PauseIcon className="size-4" />*/}
					{/*		) : (*/}
					{/*			<PlayIcon className="size-4" />*/}
					{/*		)}*/}
					{/*	</Button>*/}
					{/*)}*/}

					<Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
						<PopoverTrigger asChild>
							<Button variant="ghost" size="icon">
								<CalendarIcon className="size-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							side="bottom"
							className="flex w-36 flex-col gap-1 p-2"
						>
							<Button variant="ghost" size="sm" onClick={() => moveDeadline(0)}>
								Hoy
							</Button>
							<Button variant="ghost" size="sm" onClick={() => moveDeadline(1)}>
								Mañana
							</Button>
							<Button variant="ghost" size="sm" onClick={() => moveDeadline(7)}>
								+1 semana
							</Button>
							<TaskDatePicker
								value={deadline}
								onChange={handleDeadlineChange}
							/>
						</PopoverContent>
					</Popover>

					<AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
						<AlertDialogTrigger asChild>
							<Button variant="ghost" size="icon" onClick={openConfirm}>
								<TrashIcon className="size-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									¿Eliminar tarea “{description}”?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Esta acción no se puede deshacer. La tarea se eliminará
									permanentemente.
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
				</div>
			</div>

			<DialogContent className="flex max-h-[90vh] flex-col gap-6 overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						<Input
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="mt-4 bg-transparent font-semibold text-lg shadow-none focus:ring-0"
						/>
					</DialogTitle>
				</DialogHeader>

				<Textarea
					value={longDescription}
					onChange={(e) => setLongDescription(e.target.value)}
					placeholder="Descripción larga"
					rows={3}
				/>

				<div className="flex items-center gap-4">
					<Checkbox
						checked={status === "completed"}
						onCheckedChange={(checked) =>
							setStatus(checked ? "completed" : "pending")
						}
					/>
					<span className="select-none text-sm">{statusText}</span>
				</div>

				<div>
					<p className="mb-1 font-semibold text-muted-foreground text-xs">
						Fecha
					</p>
					<TaskDatePicker value={deadline} onChange={setDeadline} />
					{deadline && (
						<p className="mt-2 text-xs">{formatDeadline(deadline)}</p>
					)}
				</div>

				<Button
					disabled={isPending}
					onClick={saveChanges}
					className="mt-4 w-full"
				>
					Guardar cambios
				</Button>
			</DialogContent>
		</Dialog>
	);
});

TaskItem.displayName = "TaskItem";
