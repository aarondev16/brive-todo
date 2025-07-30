import { useApiMutation, useApiQuery } from "@/hooks/useApiRequest";
import type { Project } from "./useProject";

export interface Subtask {
	id: string;
	description: string;
	status: "pending" | "in-progress" | "completed";
	createdAt: string;
}

export interface Task {
	id: string;
	description: string;
	longDescription: string;
	status: "pending" | "in-progress" | "completed" | "cancelled";
	deadline?: string;
	createdAt: string;
	projectId: string;
	parentId: string | null;
	userId?: string;
	subtasks?: Subtask[];
	project?: Project;
}

export interface TaskPayload {
	description: string;
	longDescription: string;
	projectId?: string;
	parentId?: string;
	deadline?: string;
}

export interface TaskUpdatePayload {
	description?: string;
	longDescription?: string;
	status?: "pending" | "in-progress" | "completed" | "cancelled";
	deadline?: string;
}

export interface TasksResponse {
	data: Task[];
	meta: {
		status: number;
		message: string;
	};
}

export interface TaskResponse {
	data: Task;
	meta: {
		status: number;
		message: string;
	};
}

interface GetTasksOptions {
	projectId?: string | null;
	parentId?: string | null;
	enabled?: boolean;
	date?: string;
	search?: string;
	startDate?: string;
	endDate?: string;
}

/**
 * Hook para obtener lista de tareas con filtros opcionales.
 */
export const useGetTasks = (opts: GetTasksOptions = {}) => {
	const {
		projectId,
		parentId,
		enabled = true,
		date,
		search,
		startDate,
		endDate,
	} = opts;

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

/**
 * Hook para obtener una tarea única por ID.
 */
export const useGetTask = (id: string, enabled = true) =>
	useApiQuery<TaskResponse, TaskResponse>(`/tasks/${id}`, {
		enabled: !!id && enabled,
	});

/**
 * Hook para crear una nueva tarea.
 */
export const useCreateTask = () =>
	useApiMutation<Task, TaskPayload>("/tasks", "POST", {
		invalidateQueries: ["/tasks"],
		successMessage: "Tarea creada exitosamente",
		errorMessage: "Error al crear la tarea",
	});

/**
 * Hook para buscar tareas (sin ejecutar por defecto).
 */
export const useSearchTasks = () =>
	useApiQuery<TasksResponse, TasksResponse>("/tasks", {
		enabled: false,
	});

/**
 * Hook para crear tarea desde modal.
 */
export const useCreateTaskModal = () =>
	useApiMutation<Task, TaskPayload>("/tasks", "POST", {
		invalidateQueries: ["/tasks", "/tasks?projectId=null"],
		successMessage: "Tarea creada exitosamente",
		errorMessage: "Error al crear la tarea",
	});

/**
 * Hook para actualizar una tarea específica.
 * Retorna mutate(payload) y estado.
 */
export const useUpdateTask = (id: string) =>
	useApiMutation<Task, TaskUpdatePayload>(`/tasks/${id}`, "PATCH", {
		invalidateQueries: ["/tasks"],
		successMessage: "Tarea actualizada exitosamente",
		errorMessage: "Error al actualizar la tarea",
	});

/**
 * Hook para eliminar una tarea específica.
 * Retorna mutate() y estado.
 */
export const useDeleteTask = (id: string) =>
	useApiMutation<void, void>(`/tasks/${id}`, "DELETE", {
		invalidateQueries: ["/tasks"],
		successMessage: "Tarea eliminada exitosamente",
		errorMessage: "Error al eliminar la tarea",
	});
