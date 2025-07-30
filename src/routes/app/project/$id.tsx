import { createFileRoute } from "@tanstack/react-router";
import { TaskList } from "@/components/TaskList.tsx";

export const Route = createFileRoute("/app/project/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	return <TaskList scope="project" projectId={id} />;
}
