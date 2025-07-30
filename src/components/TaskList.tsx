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
import { TaskItem } from "@/components/TaskItem.tsx";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Task, useGetTasks } from "@/hooks/useTask";

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
	const { data: tasks = [] } = useGetTasks({ projectId: projectId ?? "null" });
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

	const handleStatusChange = useCallback((value: string) => {
		setStatusTab(value as "all" | Task["status"]);
	}, []);

	return (
		<div className="mx-auto w-full max-w-xl">
			<Tabs
				value={statusTab}
				onValueChange={handleStatusChange}
				className="mb-4"
			>
				<TabsList>
					<TabsTrigger value="all">Todas</TabsTrigger>
					<TabsTrigger value="pending">Pendientes</TabsTrigger>
					<TabsTrigger value="in-progress">En progreso</TabsTrigger>
					<TabsTrigger value="cancelled">Canceladas</TabsTrigger>
					<TabsTrigger value="completed">Completadas</TabsTrigger>
				</TabsList>
			</Tabs>

			{sortedGroupKeys.map((groupKey) => {
				const groupTasks = grouped[groupKey];
				const isCompletedGroup = groupKey === "Completadas";

				return (
					<Accordion
						type="single"
						collapsible
						defaultValue={isCompletedGroup ? undefined : groupKey}
						key={groupKey}
						className="mb-2"
					>
						<AccordionItem value={groupKey}>
							<AccordionTrigger className="text-left">
								{groupKey} {isCompletedGroup && `(${groupTasks.length})`}
							</AccordionTrigger>
							<AccordionContent>
								{groupTasks.map((task) => (
									<TaskItem key={task.id} task={task} />
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				);
			})}
		</div>
	);
});

TaskList.displayName = "TaskList";
