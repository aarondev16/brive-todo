import type { Project } from "@/hooks/useProject.ts";

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

export interface GetTasksOptions {
	projectId?: string | null;
	parentId?: string | null;
	enabled?: boolean;
	date?: string;
	search?: string;
	startDate?: string;
	endDate?: string;
}
