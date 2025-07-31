import {
	format,
	isAfter,
	isBefore,
	isSameDay,
	isValid,
	parse,
	parseISO,
	startOfToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { type FC, memo, useCallback, useMemo, useState } from "react";

import { TasksAccordion } from "@/components/accordions/TasksAccordion.tsx";
import { TaskItem } from "@/components/TaskItem.tsx";
import { TasksStatus } from "@/components/tabs/TasksStatus.tsx";

import {
	useGetInboxTasks,
	useGetTasks,
	useGetTodayTasks,
	useGetUpcomingTasks,
} from "@/hooks/useTask";

import type { Task } from "@/types/task.ts";

export const today = startOfToday();

const parseDeadline = (d?: string | null): Date | null => {
	if (!d) return null;

	let date = parse(d, "yyyy-MM-dd", new Date());
	if (!isValid(date)) {
		try {
			date = parseISO(d);
		} catch {
			date = new Date(d);
		}
	}
	return isValid(date) ? date : null;
};

export const formatDeadline = (d?: string | null) => {
	const date = parseDeadline(d);
	return date ? format(date, "dd/MM/yyyy") : "";
};

const taskFilters = {
	inbox: () => true,
	today: (task: Task) => {
		const d = parseDeadline(task.deadline);
		return !!d && isSameDay(d, today);
	},
	overdue: (task: Task) => {
		const d = parseDeadline(task.deadline);
		return !!d && isBefore(d, today);
	},
	upcoming: (task: Task) => {
		const d = parseDeadline(task.deadline);
		return !!d && isAfter(d, today);
	},
	noDeadline: (task: Task) => !task.deadline,
} as const;

interface TaskListProps {
	scope: "inbox" | "today" | "upcoming" | "project";
	projectId?: string;
}

const GROUP_ORDER = [
	"Hoy",
	"Vencidas",
	"Pendientes",
	"En progreso",
	"Canceladas",
	"Completadas",
] as const;

export const TaskList: FC<TaskListProps> = memo(({ scope, projectId }) => {
	const { data: inboxTasks = [] } = useGetInboxTasks({
		enabled: scope === "inbox",
	});
	const { data: todayTasks = [] } = useGetTodayTasks({
		enabled: scope === "today",
	});
	const { data: upcomingTasks = [] } = useGetUpcomingTasks({
		enabled: scope === "upcoming",
	});
	const { data: projectTasks = [] } = useGetTasks({
		projectId: projectId ?? "null",
		enabled: scope === "project",
	});

	const tasks = useMemo(() => {
		switch (scope) {
			case "inbox":
				return inboxTasks;
			case "today":
				return todayTasks;
			case "upcoming":
				return upcomingTasks;
			case "project":
			default:
				return projectTasks;
		}
	}, [scope, inboxTasks, todayTasks, upcomingTasks, projectTasks]);

	const [statusTab, setStatusTab] = useState<"all" | Task["status"]>("all");

	const baseFiltered = useMemo(() => {
		if (scope === "today") {
			return tasks.filter(
				(task) => taskFilters.today(task) || taskFilters.overdue(task),
			);
		} else if (scope === "upcoming") {
			return tasks.filter(taskFilters.upcoming);
		} else {
			return tasks;
		}
	}, [tasks, scope]);

	const statusFiltered = useMemo(() => {
		return statusTab === "all"
			? baseFiltered
			: baseFiltered.filter((task) => task.status === statusTab);
	}, [baseFiltered, statusTab]);

	const grouped = useMemo(() => {
		const groups: Record<string, Task[]> = {};

		for (const task of statusFiltered) {
			let key = "Pendientes";

			if (task.status === "completed") key = "Completadas";
			else if (task.status === "cancelled") key = "Canceladas";
			else if (task.status === "in-progress") key = "En progreso";

			if (scope === "today") {
				if (taskFilters.overdue(task)) key = "Vencidas";
				else if (taskFilters.today(task)) key = "Hoy";
			} else if (scope === "upcoming" && task.deadline) {
				const d = parseDeadline(task.deadline);
				if (d) {
					key = format(d, "EEEE dd MMMM", { locale: es });
				}
			}

			groups[key] = groups[key] ? [...groups[key], task] : [task];
		}

		return groups;
	}, [statusFiltered, scope]);

	const sortedGroupKeys = useMemo(
		() =>
			Object.keys(grouped).sort((a, b) => {
				const indexA = GROUP_ORDER.indexOf(a as (typeof GROUP_ORDER)[number]);
				const indexB = GROUP_ORDER.indexOf(b as (typeof GROUP_ORDER)[number]);

				if (indexA !== -1 && indexB !== -1) return indexA - indexB;
				if (indexA !== -1) return -1;
				if (indexB !== -1) return 1;

				return a.localeCompare(b);
			}),
		[grouped],
	);

	const TaskRow: FC<{ task: Task }> = ({ task }) => {
		return (
			<div className="flex items-center justify-between">
				<TaskItem task={task} />
			</div>
		);
	};

	const handleStatusChange = useCallback((value: string) => {
		setStatusTab(value as "all" | Task["status"]);
	}, []);

	return (
		<div className="mx-auto w-full max-w-xl">
			<TasksStatus value={statusTab} onValueChange={handleStatusChange} />

			{sortedGroupKeys.map((groupKey) => {
				const groupTasks = grouped[groupKey];
				const isCompletedGroup = groupKey === "Completadas";

				return (
					<TasksAccordion
						key={groupKey}
						completedGroup={isCompletedGroup}
						groupKey={groupKey}
						tasks={groupTasks}
						callbackfn={(task) => <TaskRow key={task.id} task={task} />}
					/>
				);
			})}
		</div>
	);
});

TaskList.displayName = "TaskList";
