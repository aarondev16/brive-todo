import { useApiMutation, useApiQuery } from "@/hooks/useApiRequest";
import type {
	GetTasksOptions,
	Task,
	TaskPayload,
	TaskResponse,
	TasksResponse,
	TaskUpdatePayload,
} from "@/types/task.ts";

const TODAY_STR = new Date().toISOString().split("T")[0];

const buildParams = (opts: GetTasksOptions = {}) => {
	const { projectId, parentId, date, search, startDate, endDate } = opts;

	const params = new URLSearchParams();

	if (projectId !== undefined) {
		params.set("projectId", projectId === null ? "null" : projectId);
	}
	if (parentId !== undefined) {
		params.set("parentId", parentId === null ? "null" : parentId);
	}
	if (date !== undefined) {
		params.set("date", date);
	}
	if (search !== undefined) {
		params.set("search", search);
	}
	if (startDate !== undefined) {
		params.set("startDate", startDate);
	}
	if (endDate !== undefined) {
		params.set("endDate", endDate);
	}

	return params;
};

export const useGetTasks = (opts: GetTasksOptions = {}) => {
	const { enabled = true, ...rest } = opts;
	const params = buildParams(rest);

	const endpoint = `/tasks${params.toString() ? `?${params.toString()}` : ""}`;

	const query = useApiQuery<TasksResponse, TasksResponse>(endpoint, {
		enabled,
	});

	return {
		...query,
		data: query.data?.data ?? [],
		meta: query.data?.meta,
	};
};

export const useGetInboxTasks = (
	extraOpts: Omit<GetTasksOptions, "projectId" | "date" | "startDate"> = {},
) => useGetTasks({ ...extraOpts, projectId: null });

export const useGetTodayTasks = (
	extraOpts: Omit<GetTasksOptions, "date" | "projectId" | "startDate"> = {},
) => useGetTasks({ ...extraOpts, date: TODAY_STR });

export const useGetUpcomingTasks = (
	extraOpts: Omit<GetTasksOptions, "startDate" | "projectId" | "date"> = {},
) => useGetTasks({ ...extraOpts, startDate: TODAY_STR });

export const useGetTask = (id: string, enabled = true) =>
	useApiQuery<TaskResponse, TaskResponse>(`/tasks/${id}`, {
		enabled: !!id && enabled,
	});

export const useCreateTask = () =>
	useApiMutation<Task, TaskPayload>("/tasks", "POST", {
		invalidateQueries: [
			"/tasks",
			"/tasks?projectId=null",
			`/tasks?date=${TODAY_STR}`,
			`/tasks?startDate=${TODAY_STR}`,
		],
		successMessage: "Tarea creada exitosamente",
		errorMessage: "Error al crear la tarea",
	});

export const useSearchTasks = () =>
	useApiQuery<TasksResponse, TasksResponse>("/tasks", {
		enabled: false,
	});

export const useCreateTaskModal = () =>
	useApiMutation<Task, TaskPayload>("/tasks", "POST", {
		invalidateQueries: [
			"/tasks",
			"/tasks?projectId=null",
			`/tasks?date=${TODAY_STR}`,
			`/tasks?startDate=${TODAY_STR}`,
		],
		successMessage: "Tarea creada exitosamente",
		errorMessage: "Error al crear la tarea",
	});

export const useUpdateTask = (id: string) =>
	useApiMutation<Task, TaskUpdatePayload>(`/tasks/${id}`, "PATCH", {
		invalidateQueries: [
			"/tasks",
			"/tasks?projectId=null",
			`/tasks?date=${TODAY_STR}`,
			`/tasks?startDate=${TODAY_STR}`,
		],
		successMessage: "Tarea actualizada exitosamente",
		errorMessage: "Error al actualizar la tarea",
	});

export const useDeleteTask = (id: string) =>
	useApiMutation<void, void>(`/tasks/${id}`, "DELETE", {
		invalidateQueries: [
			"/tasks",
			"/tasks?projectId=null",
			`/tasks?date=${TODAY_STR}`,
			`/tasks?startDate=${TODAY_STR}`,
		],
		successMessage: "Tarea eliminada exitosamente",
		errorMessage: "Error al eliminar la tarea",
	});
