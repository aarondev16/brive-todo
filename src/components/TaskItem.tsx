import { DialogDescription } from "@radix-ui/react-dialog";
import { addDays, format } from "date-fns";
import { type FC, memo, useEffect, useState } from "react";
import { DeleteTask } from "@/components/alerts/DeleteTask.tsx";
import { TaskDatePicker } from "@/components/calendar-19.tsx";
import { TaskDateActions } from "@/components/popovers/TaskDateActions.tsx";
import { formatDeadline, today } from "@/components/TaskList.tsx";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTask.ts";
import type { Task } from "@/types/task.ts";

export const formatSimple = (d?: string | null): string | null => {
	if (!d) return null;
	const d2 = d.split("T");
	const [day, month, year] = d2[0].split("-");
	return `${year}-${month}-${day}`;
};

export const TaskItem: FC<{ task: Task }> = memo(({ task }) => {
	const { mutate: update, isPending } = useUpdateTask(task.id);
	const { mutate: deleteTask } = useDeleteTask(task.id);

	const [open, setOpen] = useState(false);
	const [isDateOpen, setIsDateOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const [editDescription, setEditDescription] = useState(task.description);
	const [editLongDescription, setEditLongDescription] = useState(
		task.longDescription,
	);
	const [editStatus, setEditStatus] = useState<Task["status"]>(task.status);
	const [editDeadline, setEditDeadline] = useState<string | null>(
		task.deadline ?? null,
	);

	useEffect(() => {
		if (open) {
			setEditDescription(task.description);
			setEditLongDescription(task.longDescription);
			setEditStatus(task.status);
			setEditDeadline(task.deadline ?? null);
		}
		formatDeadline;
	}, [open, task]);

	const patch = (body: Partial<Task>) => update(body);

	const handleToggleCompleted = (checked: boolean) => {
		const newStatus: Task["status"] = checked ? "completed" : "pending";
		patch({ status: newStatus });
	};

	const moveDeadline = (days: number) => {
		const newDate = format(addDays(today, days), "yyyy-MM-dd");
		patch({ deadline: newDate });
	};

	const saveChanges = () => {
		const updates: Partial<Task> = {
			description: editDescription?.trim(),
			longDescription: editLongDescription?.trim(),
			status: editStatus,
		};

		if (editDeadline) {
			updates.deadline = editDeadline;
		} else {
			updates.deadline = undefined;
		}

		patch(updates);
		setOpen(false);
	};

	const openConfirm = () => setConfirmOpen(true);
	const closeConfirm = () => setConfirmOpen(false);
	const confirmDelete = () => {
		deleteTask();
		closeConfirm();
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="group flex w-full items-center justify-between gap-3 border-border border-b py-3">
				<Checkbox
					checked={task.status === "completed"}
					onCheckedChange={(checked) => handleToggleCompleted(!!checked)}
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
							task.status === "cancelled"
								? "text-muted-foreground line-through"
								: ""
						}
					>
						{task.description}
					</p>
					{task.longDescription && (
						<p className="text-muted-foreground text-sm">
							{task.longDescription}
						</p>
					)}
					{task.deadline && (
						<span className="text-primary text-xs">
							{formatSimple(task.deadline)}
						</span>
					)}
				</button>

				<div className="flex items-center gap-1">
					<Select
						value={task.status}
						onValueChange={(value) =>
							patch({ status: value as Task["status"] })
						}
						disabled={false}
					>
						<SelectTrigger className="max-w-32">
							<SelectValue placeholder="Estado" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="pending">Pendiente</SelectItem>
							<SelectItem value="in-progress">En progreso</SelectItem>
							<SelectItem value="cancelled">Cancelada</SelectItem>
							<SelectItem value="completed">Completada</SelectItem>
						</SelectContent>
					</Select>

					{task.status === "cancelled" && (
						<DeleteTask
							open={confirmOpen}
							onOpenChange={setConfirmOpen}
							onClick={openConfirm}
							description={task.description}
							onClick1={confirmDelete}
						/>
					)}

					{task.status !== "cancelled" && (
						<TaskDateActions
							open={isDateOpen}
							onOpenChange={setIsDateOpen}
							onClick={() => moveDeadline(0)}
							onClick1={() => moveDeadline(1)}
							onClick2={() => moveDeadline(7)}
							value={task.deadline ?? null}
							onChange={(date) => patch({ deadline: date ?? undefined })}
						/>
					)}
				</div>
			</div>

			<DialogContent className="flex w-full max-w-[350px] flex-col gap-6 overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{task.description}</DialogTitle>
					<DialogDescription />
				</DialogHeader>
				<Input
					value={editDescription}
					onChange={(e) => setEditDescription(e.target.value)}
					className="bg-transparent font-semibold text-lg shadow-none focus:ring-0"
				/>
				<Textarea
					value={editLongDescription}
					onChange={(e) => setEditLongDescription(e.target.value)}
					placeholder="Descripción larga"
					rows={3}
				/>

				<div className="flex items-center gap-4">
					<div>
						<p className="mb-1 font-semibold text-muted-foreground text-xs">
							Estado
						</p>
						<Select
							value={editStatus}
							onValueChange={(value) => setEditStatus(value as Task["status"])}
						>
							<SelectTrigger className="max-w-32">
								<SelectValue placeholder="Estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="pending">Pendiente</SelectItem>
								<SelectItem value="in-progress">En progreso</SelectItem>
								<SelectItem value="completed">Completada</SelectItem>
								<SelectItem value="cancelled">Cancelada</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<p className="mb-1 font-semibold text-muted-foreground text-xs">
							Fecha
						</p>
						<TaskDatePicker value={editDeadline} onChange={setEditDeadline} />
					</div>
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
