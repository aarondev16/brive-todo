import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

function ProjectPage() {
	const { id } = Route.useParams();

	return <TaskList scope="project" projectId={id} />;
}

export const Route = createFileRoute("/app/project/$id")({
	component: ProjectPage,
});
