import { useApiMutation, useApiQuery } from "@/hooks/useApiRequest";

export interface Project {
	id: string;
	name: string;
	userId: string;
	createdAt: string;
}

export interface ProjectPayload {
	name: string;
}

export interface ProjectsResponse {
	data: Project[];
	meta: {
		status: number;
		message: string;
	};
}

interface GetProjectsOptions {
	enabled?: boolean;
}

export const useGetProjects = (opts: GetProjectsOptions = {}) => {
	const { enabled = true } = opts;

	const endpoint = "/projects";

	const query = useApiQuery<ProjectsResponse, ProjectsResponse>(endpoint, {
		enabled,
	});

	const data = query.data?.data ?? [];
	const meta = query.data?.meta;

	return {
		...query,
		data,
		meta,
	};
};

export const useGetProject = (id: string, enabled = true) =>
	useApiQuery<Project>(`/projects/${id}`, { enabled: !!id && enabled });

export const useCreateProject = () =>
	useApiMutation<Project, ProjectPayload>("/projects", "POST", {
		invalidateQueries: ["/projects"],
		successMessage: "Proyecto creado exitosamente",
		errorMessage: "Error al crear el proyecto",
	});

export const useDeleteProject = () =>
	useApiMutation<void, { id: string }>(
		(variables) => `/projects/${variables.id}`,
		"DELETE",
		{
			invalidateQueries: ["/projects"],
			successMessage: "Proyecto eliminado exitosamente",
			errorMessage: "Error al eliminar el proyecto",
		},
	);
